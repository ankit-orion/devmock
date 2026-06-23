import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireUserId,
  DIFFICULTY_MAP,
  FOCUS_MAP,
  getGrounding,
} from "@/lib/server/interview";
import { generateQuestion } from "@/lib/ai/interviewer";

export const runtime = "nodejs";

type PlanRoundInput = {
  name: string;
  type: "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL";
  focusAreas: string[];
  count: number;
};

// GET /api/sessions — list the signed-in user's sessions
export async function GET() {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      company: true,
      role: true,
      status: true,
      overallScore: true,
      createdAt: true,
      _count: { select: { rounds: true } },
    },
  });
  return NextResponse.json({ sessions });
}

// POST /api/sessions — create a session from the confirmed plan + generate Q1
export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    company,
    role,
    jobDescription,
    difficulty = "Mid",
    focus = "Mixed",
    rounds,
    resumeText,
    resumeFileName,
  } = body ?? {};

  if (!role || !Array.isArray(rounds) || rounds.length === 0) {
    return NextResponse.json({ error: "Role and rounds are required" }, { status: 400 });
  }

  try {
    // optional resume
    let resumeId: string | undefined;
    if (resumeText) {
      const r = await prisma.resume.create({
        data: { userId, rawText: resumeText, fileName: resumeFileName ?? null },
      });
      resumeId = r.id;
    }

    const session = await prisma.interviewSession.create({
      data: {
        userId,
        company: company || null,
        role,
        jobDescription: jobDescription || null,
        difficulty: DIFFICULTY_MAP[difficulty] ?? "MID",
        focus: FOCUS_MAP[focus] ?? "MIXED",
        resumeId,
        currentRound: 0,
        rounds: {
          create: (rounds as PlanRoundInput[]).map((r, i) => ({
            name: r.name,
            type: r.type,
            focusAreas: r.focusAreas ?? [],
            order: i,
            targetCount: Math.max(1, r.count ?? 1),
            status: i === 0 ? "IN_PROGRESS" : "PENDING",
          })),
        },
      },
      include: { rounds: { orderBy: { order: "asc" } }, resume: true },
    });

    const firstRound = session.rounds[0];
    const grounding = await getGrounding(session, firstRound.type);

    const q = await generateQuestion({
      company: session.company,
      role: session.role,
      roundName: firstRound.name,
      roundType: firstRound.type,
      focusAreas: (firstRound.focusAreas as string[]) ?? [],
      transcript: [],
      bankQuestions: grounding.bankQuestions,
      resumeProjects: grounding.resumeProjects,
    });

    const question = await prisma.question.create({
      data: {
        roundId: firstRound.id,
        text: q.text,
        order: 0,
        category: q.category,
        source: q.source,
      },
    });

    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { inputTokens: { increment: q.usage.input }, outputTokens: { increment: q.usage.output } },
    });

    return NextResponse.json({
      sessionId: session.id,
      round: {
        index: 0,
        total: session.rounds.length,
        name: firstRound.name,
        type: firstRound.type,
      },
      question: { id: question.id, text: question.text, category: question.category },
    });
  } catch (e) {
    console.error("create session error", e);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
