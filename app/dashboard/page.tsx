import Link from "next/link";
import { CtaButton } from "@/components/ui/CtaButton";

// The dashboard is user-specific and renders Clerk UI, so it must render
// dynamically (never statically prerendered at build time).
export const dynamic = "force-dynamic";

const stats = [
  { label: "Interviews", value: "12", sub: "+3 this week", accent: "#a78bfa" },
  { label: "Avg. score", value: "78", sub: "out of 100", accent: "#7aa2f7" },
  { label: "Readiness", value: "82%", sub: "↑ 6% this week", accent: "#8bd5a0" },
  { label: "Day streak", value: "5", sub: "best: 9 days", accent: "#f5a97f" },
];

const sessions = [
  { company: "Amazon", role: "SDE II", type: "Coding", typeColor: "#a78bfa", date: "Jun 14", score: "82", status: "Completed", statusColor: "#16a34a" },
  { company: "Google", role: "Frontend Engineer", type: "System Design", typeColor: "#f5a97f", date: "Jun 11", score: "76", status: "Completed", statusColor: "#16a34a" },
  { company: "Meta", role: "E4 Product Eng", type: "Behavioral", typeColor: "#7aa2f7", date: "Jun 9", score: "—", status: "In progress", statusColor: "#d97706" },
  { company: "Stripe", role: "Backend Engineer", type: "Coding", typeColor: "#a78bfa", date: "Jun 5", score: "88", status: "Completed", statusColor: "#16a34a" },
  { company: "Netflix", role: "Senior Engineer", type: "System Design", typeColor: "#f5a97f", date: "Jun 2", score: "79", status: "Completed", statusColor: "#16a34a" },
];

const skills = [
  { label: "Data Structures", value: 88, color: "#a78bfa" },
  { label: "System Design", value: 72, color: "#7aa2f7" },
  { label: "Behavioral", value: 84, color: "#8bd5a0" },
  { label: "Communication", value: 90, color: "#5bc0c0" },
];

const trend = [62, 66, 64, 71, 74, 78, 82];

function TrendChart() {
  const min = 55;
  const max = 92;
  const pts = trend.map((s, i) => {
    const x = (i / (trend.length - 1)) * 100;
    const y = 40 - ((s - min) / (max - min)) * 36 - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,40 ${line} 100,40`;
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-24 w-full">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7aa2f7" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#7aa2f7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#trendFill)" />
      <polyline
        points={line}
        fill="none"
        stroke="#7aa2f7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight text-ink">
            Welcome back, Aditya
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Here&apos;s how your interview prep is going.
          </p>
        </div>
        <CtaButton href="/interview/new" className="shrink-0">
          + New interview
        </CtaButton>
      </div>

      {/* Stat cards */}
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Recent sessions</h2>
            <Link href="/dashboard/history" className="text-xs font-medium text-ink-soft transition-colors hover:text-ink">
              View all
            </Link>
          </div>

          <div className="mt-4 flex flex-col">
            {sessions.map((s) => (
              <div
                key={s.company}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: s.typeColor }}>
                  {s.company[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {s.company} · <span className="text-ink-soft">{s.role}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.typeColor }} />
                      {s.type}
                    </span>
                    <span>·</span>
                    <span>{s.date}</span>
                  </p>
                </div>
                <span className="text-sm font-semibold text-ink">{s.score}</span>
                <span className="w-20 text-right text-[11px] font-medium" style={{ color: s.statusColor }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Score trend */}
          <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Score trend</h2>
              <span className="rounded-full bg-[#8bd5a0]/15 px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">
                ↑ 20 pts
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted">Last 7 sessions</p>
            <div className="mt-3">
              <TrendChart />
            </div>
          </div>

          {/* Skill breakdown */}
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
        </div>
      </div>
    </div>
  );
}
