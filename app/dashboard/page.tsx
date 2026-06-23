import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { CtaButton } from "@/components/ui/CtaButton";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  CODING: "#a78bfa",
  SYSTEM_DESIGN: "#f5a97f",
  BEHAVIORAL: "#7aa2f7",
  MIXED: "#5bc0c0",
};
const CAT_PALETTE = ["#a78bfa", "#7aa2f7", "#f5a97f", "#5bc0c0", "#8bd5a0", "#efd97a"];

type SessionRow = {
  id: string;
  company: string | null;
  role: string;
  status: string;
  overallScore: number | null;
  categoryScores: unknown;
  createdAt: Date;
};

async function getData(userId: string | null) {
  if (!userId) return { sessions: [] as SessionRow[] };
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        company: true,
        role: true,
        status: true,
        overallScore: true,
        categoryScores: true,
        createdAt: true,
      },
    });
    return { sessions };
  } catch {
    return { sessions: [] as SessionRow[] };
  }
}

function TrendChart({ scores }: { scores: number[] }) {
  if (scores.length < 2) {
    return <p className="py-6 text-center text-xs text-muted">Complete more interviews to see a trend.</p>;
  }
  const min = 40;
  const max = 100;
  const pts = scores.map((s, i) => {
    const x = (i / (scores.length - 1)) * 100;
    const y = 40 - ((Math.max(min, Math.min(max, s)) - min) / (max - min)) * 36 - 2;
    return `${x},${y}`;
  });
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-24 w-full">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,40 ${pts.join(" ")} 100,40`} fill="url(#trendFill)" />
      <polyline points={pts.join(" ")} fill="none" stroke="#7aa2f7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const { sessions } = await getData(userId);

  const completed = sessions.filter((s) => s.overallScore != null);
  const avgScore = completed.length
    ? Math.round(completed.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / completed.length)
    : null;
  const trendScores = [...completed].reverse().map((s) => s.overallScore as number);

  // aggregate category scores
  const catTotals: Record<string, { sum: number; n: number }> = {};
  for (const s of completed) {
    const cs = s.categoryScores;
    if (cs && typeof cs === "object" && !Array.isArray(cs)) {
      for (const [k, v] of Object.entries(cs as Record<string, unknown>)) {
        const num = typeof v === "number" ? v : Number(v);
        if (!Number.isNaN(num)) {
          catTotals[k] = catTotals[k] ?? { sum: 0, n: 0 };
          catTotals[k].sum += num;
          catTotals[k].n += 1;
        }
      }
    }
  }
  const skills = Object.entries(catTotals)
    .map(([label, { sum, n }], i) => ({ label, value: Math.round(sum / n), color: CAT_PALETTE[i % CAT_PALETTE.length] }))
    .slice(0, 6);

  const stats = [
    { label: "Interviews", value: String(sessions.length), sub: `${completed.length} completed`, accent: "#a78bfa" },
    { label: "Avg. score", value: avgScore != null ? String(avgScore) : "—", sub: "out of 100", accent: "#7aa2f7" },
    { label: "In progress", value: String(sessions.filter((s) => s.status === "IN_PROGRESS").length), sub: "resume anytime", accent: "#f5a97f" },
    { label: "Best score", value: completed.length ? String(Math.max(...completed.map((s) => s.overallScore ?? 0))) : "—", sub: "personal best", accent: "#8bd5a0" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">Track your interview prep and start a new session.</p>
        </div>
        <CtaButton href="/interview/new" className="shrink-0">+ New interview</CtaButton>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-card p-4 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.accent }} />
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{s.label}</span>
            </div>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-muted">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent sessions */}
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)] lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink">Recent sessions</h2>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm text-ink-soft">No interviews yet.</p>
              <Link href="/interview/new" className="rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen dark:from-white dark:to-[#dcdce0] dark:text-[#161619]">Start your first interview</Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col">
              {sessions.map((s) => {
                const href = s.status === "COMPLETED" ? `/interview/${s.id}/results` : `/interview/${s.id}`;
                return (
                  <Link key={s.id} href={href} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#a78bfa] to-[#7aa2f7] text-xs font-bold text-white">
                      {(s.company || s.role || "?")[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{s.company ? `${s.company} · ` : ""}<span className="text-ink-soft">{s.role}</span></p>
                      <p className="mt-0.5 text-[11px] text-muted">{new Date(s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                    </div>
                    <span className="text-sm font-semibold text-ink">{s.overallScore ?? "—"}</span>
                    <span className="w-20 text-right text-[11px] font-medium" style={{ color: s.status === "COMPLETED" ? "#16a34a" : "#d97706" }}>
                      {s.status === "COMPLETED" ? "Completed" : s.status === "IN_PROGRESS" ? "In progress" : "Abandoned"}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
            <h2 className="text-sm font-semibold text-ink">Score trend</h2>
            <p className="mt-1 text-[11px] text-muted">Completed sessions over time</p>
            <div className="mt-3"><TrendChart scores={trendScores} /></div>
          </div>

          {skills.length > 0 && (
            <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
              <h2 className="text-sm font-semibold text-ink">Skill breakdown</h2>
              <div className="mt-4 flex flex-col gap-3">
                {skills.map((sk) => (
                  <div key={sk.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-ink-soft">{sk.label}</span>
                      <span className="text-xs font-medium text-muted">{sk.value}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                      <div className="h-full rounded-full" style={{ width: `${sk.value}%`, background: sk.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
