import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, getGrounding } from "@/lib/server/interview";
import { generateQuestion, evaluateAnswer } from "@/lib/ai/interviewer";
import type { TranscriptItem } from "@/lib/ai/interviewer";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId } = await params;
  const body = await req.json().catch(() => ({}));
  const { questionId, answer, language } = body ?? {};
  if (!questionId || typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json({ error: "questionId and answer are required" }, { status: 400 });
  }

  const session = await prisma.interviewSession.findUnique({
    where: { id: sessionId },
    include: {
      resume: true,
      rounds: {
        orderBy: { order: "asc" },
        include: { questions: { orderBy: { order: "asc" }, include: { answer: true } } },
      },
    },
  });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { round: true, answer: true },
  });
  if (!question || question.round.sessionId !== sessionId) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }
  if (question.answer) {
    return NextResponse.json({ error: "Question already answered" }, { status: 409 });
  }

  const round = question.round;
  const isFollowUp = question.parentQuestionId != null;

  try {
    // 1) persist + evaluate the answer
    const evalRes = await evaluateAnswer({
      roundType: round.type,
      question: question.text,
      answer,
      alreadyFollowedUp: isFollowUp,
    });

    await prisma.answer.create({
      data: {
        questionId: question.id,
        content: answer,
        language: language ?? null,
        score: evalRes.score,
        strengths: evalRes.strengths,
        weaknesses: evalRes.weaknesses,
        feedback: evalRes.feedback,
      },
    });

    let usedInput = evalRes.usage.input;
    let usedOutput = evalRes.usage.output;

    const feedback = {
      score: evalRes.score,
      strengths: evalRes.strengths,
      weaknesses: evalRes.weaknesses,
      feedback: evalRes.feedback,
    };

    // helper: transcript for this round
    const roundData = session.rounds.find((r) => r.id === round.id)!;
    const buildTranscript = (): TranscriptItem[] => {
      const items: TranscriptItem[] = [];
      for (const q of roundData.questions) {
        items.push({ role: "ai", text: q.text });
        if (q.answer) items.push({ role: "user", text: q.answer.content });
      }
      // include the just-answered question
      items.push({ role: "ai", text: question.text });
      items.push({ role: "user", text: answer });
      return items;
    };

    // 2) follow-up?
    if (evalRes.needsFollowUp && evalRes.followUpQuestion && !isFollowUp) {
      const orderBase = roundData.questions.length + 1;
      const fq = await prisma.question.create({
        data: {
          roundId: round.id,
          text: evalRes.followUpQuestion,
          order: orderBase,
          parentQuestionId: question.id,
          source: "GENERATED",
        },
      });
      await bumpUsage(sessionId, usedInput, usedOutput);
      return NextResponse.json({
        feedback,
        next: { kind: "followup", id: fq.id, text: fq.text },
      });
    }

    // 3) round complete?
    const answeredPrimaries =
      roundData.questions.filter((q) => q.parentQuestionId == null && q.answer).length +
      (question.parentQuestionId == null ? 1 : 0);

    if (answeredPrimaries < round.targetCount) {
      // next question in this round
      const grounding = await getGrounding(session, round.type);
      const gen = await generateQuestion({
        company: session.company,
        role: session.role,
        roundName: round.name,
        roundType: round.type,
        focusAreas: (round.focusAreas as string[]) ?? [],
        transcript: buildTranscript(),
        bankQuestions: grounding.bankQuestions,
        resumeProjects: grounding.resumeProjects,
      });
      usedInput += gen.usage.input;
      usedOutput += gen.usage.output;
      const nq = await prisma.question.create({
        data: {
          roundId: round.id,
          text: gen.text,
          order: roundData.questions.length + 2,
          category: gen.category,
          source: gen.source,
        },
      });
      await bumpUsage(sessionId, usedInput, usedOutput);
      return NextResponse.json({
        feedback,
        next: { kind: "question", id: nq.id, text: nq.text, category: nq.category },
      });
    }

    // round is done — score it
    const roundAnswers = await prisma.answer.findMany({
      where: { question: { roundId: round.id }, score: { not: null } },
      select: { score: true },
    });
    const roundScore =
      roundAnswers.length > 0
        ? Math.round((roundAnswers.reduce((s, a) => s + (a.score ?? 0), 0) / roundAnswers.length) * 10)
        : null;
    await prisma.round.update({
      where: { id: round.id },
      data: { status: "COMPLETED", score: roundScore },
    });

    // 4) next round?
    const nextRound = session.rounds.find((r) => r.order === round.order + 1);
    if (nextRound) {
      await prisma.round.update({ where: { id: nextRound.id }, data: { status: "IN_PROGRESS" } });
      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: { currentRound: nextRound.order },
      });
      const grounding = await getGrounding(session, nextRound.type);
      const gen = await generateQuestion({
        company: session.company,
        role: session.role,
        roundName: nextRound.name,
        roundType: nextRound.type,
        focusAreas: (nextRound.focusAreas as string[]) ?? [],
        transcript: [],
        bankQuestions: grounding.bankQuestions,
        resumeProjects: grounding.resumeProjects,
      });
      usedInput += gen.usage.input;
      usedOutput += gen.usage.output;
      const nq = await prisma.question.create({
        data: {
          roundId: nextRound.id,
          text: gen.text,
          order: 0,
          category: gen.category,
          source: gen.source,
        },
      });
      await bumpUsage(sessionId, usedInput, usedOutput);
      return NextResponse.json({
        feedback,
        transition: {
          index: nextRound.order,
          total: session.rounds.length,
          name: nextRound.name,
          type: nextRound.type,
        },
        next: { kind: "question", id: nq.id, text: nq.text, category: nq.category },
      });
    }

    // 5) all rounds done
    await bumpUsage(sessionId, usedInput, usedOutput);
    return NextResponse.json({ feedback, complete: true });
  } catch (e) {
    console.error("turn error", e);
    return NextResponse.json({ error: "Failed to process answer" }, { status: 500 });
  }
}

async function bumpUsage(sessionId: string, input: number, output: number) {
  if (!input && !output) return;
  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: { inputTokens: { increment: input }, outputTokens: { increment: output } },
  });
}
