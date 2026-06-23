import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/server/interview";
import { generateScorecard } from "@/lib/ai/scorecard";

export const runtime = "nodejs";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const session = await prisma.interviewSession.findUnique({
    where: { id },
    include: {
      rounds: {
        orderBy: { order: "asc" },
        include: { questions: { orderBy: { order: "asc" }, include: { answer: true } } },
      },
    },
  });
  if (!session || session.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // already scored — return existing
  if (session.status === "COMPLETED" && session.overallScore != null) {
    return NextResponse.json({ scorecard: serialize(session) });
  }

  const transcript = session.rounds.map((r) => ({
    round: r.name,
    type: r.type,
    qa: r.questions
      .filter((q) => q.answer)
      .map((q) => ({ q: q.text, a: q.answer!.content, score: q.answer!.score ?? undefined })),
  }));

  try {
    const { scorecard, usage } = await generateScorecard({
      company: session.company,
      role: session.role,
      transcript,
    });

    const updated = await prisma.interviewSession.update({
      where: { id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
        overallScore: scorecard.overallScore,
        verdict: scorecard.verdict,
        summary: scorecard.summary,
        categoryScores: scorecard.categoryScores,
        strengths: scorecard.strengths,
        improvements: scorecard.improvements,
        inputTokens: { increment: usage.input },
        outputTokens: { increment: usage.output },
      },
      include: {
        rounds: { orderBy: { order: "asc" }, include: { questions: { orderBy: { order: "asc" }, include: { answer: true } } } },
      },
    });

    return NextResponse.json({ scorecard: serialize(updated) });
  } catch (e) {
    console.error("complete error", e);
    return NextResponse.json({ error: "Failed to generate scorecard" }, { status: 500 });
  }
}

type SessionFull = Awaited<ReturnType<typeof prisma.interviewSession.findUnique>> & {
  rounds: {
    name: string;
    type: string;
    score: number | null;
    questions: { text: string; category: string | null; answer: { content: string; score: number | null; feedback: string | null } | null }[];
  }[];
};

function serialize(s: SessionFull) {
  return {
    company: s!.company,
    role: s!.role,
    overallScore: s!.overallScore,
    verdict: s!.verdict,
    summary: s!.summary,
    categoryScores: s!.categoryScores,
    strengths: s!.strengths,
    improvements: s!.improvements,
    rounds: s!.rounds.map((r) => ({
      name: r.name,
      type: r.type,
      score: r.score,
      questions: r.questions
        .filter((q) => q.answer)
        .map((q) => ({
          q: q.text,
          tests: q.category,
          note: q.answer?.feedback ?? "",
        })),
    })),
  };
}
