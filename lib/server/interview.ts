import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

export const DIFFICULTY_MAP: Record<string, "JUNIOR" | "MID" | "SENIOR"> = {
  Junior: "JUNIOR",
  Mid: "MID",
  Senior: "SENIOR",
};

export const FOCUS_MAP: Record<string, "MIXED" | "CODING" | "SYSTEM_DESIGN" | "BEHAVIORAL"> = {
  Mixed: "MIXED",
  Coding: "CODING",
  "System Design": "SYSTEM_DESIGN",
  Behavioral: "BEHAVIORAL",
};

export const TYPE_LABEL: Record<string, string> = {
  CODING: "Coding",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  MIXED: "Mixed",
};

type SessionWithResume = {
  company: string | null;
  resume: { parsedProjects: unknown } | null;
};

/** Question-bank + resume grounding for the AI question generator. */
export async function getGrounding(session: SessionWithResume, roundType?: string) {
  const bank = await prisma.questionBankEntry.findMany({
    where: {
      OR: [
        session.company ? { company: { equals: session.company, mode: "insensitive" } } : {},
        { company: null },
      ],
    },
    take: 8,
  });

  // light filter by round type keyword when possible
  let bankQuestions = bank.map((b) => b.text);
  if (roundType === "CODING") {
    const dsa = bank.filter((b) => /DSA|Coding|Array|Tree|Graph|String/i.test(b.category)).map((b) => b.text);
    if (dsa.length) bankQuestions = dsa;
  } else if (roundType === "BEHAVIORAL") {
    const beh = bank.filter((b) => /LP|Behav|Ownership|Teamwork|Failure/i.test(b.category)).map((b) => b.text);
    if (beh.length) bankQuestions = beh;
  } else if (roundType === "SYSTEM_DESIGN") {
    const sd = bank.filter((b) => /System Design|Caching|Scal/i.test(b.category)).map((b) => b.text);
    if (sd.length) bankQuestions = sd;
  }

  let resumeProjects: string[] = [];
  const projs = session.resume?.parsedProjects;
  if (Array.isArray(projs)) {
    resumeProjects = projs
      .map((p) => (p && typeof p === "object" && "name" in p ? String((p as { name: unknown }).name) : null))
      .filter((x): x is string => !!x);
  }
  return { bankQuestions: bankQuestions.slice(0, 6), resumeProjects };
}
