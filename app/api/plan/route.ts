import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/server/interview";
import { planInterview } from "@/lib/ai/planner";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { company, role, jobDescription, difficulty = "Mid", focus = "Mixed" } = body ?? {};
  if (!role) return NextResponse.json({ error: "Role is required" }, { status: 400 });

  let template: unknown = null;
  if (company) {
    const t = await prisma.companyInterviewTemplate.findFirst({
      where: { company: { equals: company, mode: "insensitive" } },
    });
    template = t?.rounds ?? null;
  }

  try {
    const { rounds } = await planInterview({
      company,
      role,
      jobDescription,
      difficulty,
      focus,
      companyTemplate: template,
    });
    return NextResponse.json({ rounds });
  } catch (e) {
    console.error("plan error", e);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}
