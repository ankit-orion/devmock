import { Logo } from "@/components/ui/Logo";

type Card = {
  id: string;
  title: string;
  tags: string[];
  priority?: "High" | "Medium" | "Low";
  score?: string;
  passed?: boolean;
};

type Column = {
  title: string;
  bulletColor: string;
  badgeBg: string;
  textColor: string;
  cards: Card[];
};

const columns: Column[] = [
  {
    title: "To-do",
    bulletColor: "#a78bfa", // purple
    badgeBg: "rgba(167, 139, 250, 0.12)",
    textColor: "text-purple-600 dark:text-purple-400",
    cards: [
      { id: "card_behavioral", title: "Behavioral LP Questions", tags: ["Behavioral", "P1"], priority: "High" },
      { id: "card_balancer", title: "System Design: Load Balancer", tags: ["Design", "P2"], priority: "Medium" }
    ]
  },
  {
    title: "In progress",
    bulletColor: "#f59e0b", // amber
    badgeBg: "rgba(245, 158, 11, 0.12)",
    textColor: "text-amber-600 dark:text-amber-400",
    cards: [
      { id: "card_caching", title: "System Design: Caching", tags: ["Design", "Active"], priority: "High" },
      { id: "card_dp", title: "Coding: DP Prep", tags: ["Coding", "Medium"] }
    ]
  },
  {
    title: "In review",
    bulletColor: "#3b82f6", // blue
    badgeBg: "rgba(59, 130, 246, 0.12)",
    textColor: "text-blue-600 dark:text-blue-400",
    cards: [
      { id: "card_mock2", title: "Mock Interview #2", tags: ["Mock", "Reviewing"], priority: "Medium" },
      { id: "card_databases", title: "System Design: Databases", tags: ["Design", "Reviewing"], priority: "High" }
    ]
  },
  {
    title: "Complete",
    bulletColor: "#22c55e", // green
    badgeBg: "rgba(34, 197, 94, 0.12)",
    textColor: "text-green-600 dark:text-green-400",
    cards: [
      { id: "card_arrays", title: "Coding Round: Arrays", tags: ["Coding"], score: "8.5/10", passed: true },
      { id: "card_behavioral_intro", title: "Behavioral: Intro", tags: ["Behavioral"], score: "9.0/10", passed: true }
    ]
  }
];

export function HeroDashboard({ activeCard = null }: { activeCard?: string | null }) {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_30px_70px_-30px_rgba(20,20,40,0.35)] select-none">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-40 shrink-0 flex-col border-r border-line bg-card p-3 lg:flex">
            <div className="flex items-center justify-between px-1 py-1.5 border-b border-line pb-2.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-500 font-bold text-[10px]">
                  GP
                </span>
                <span className="font-semibold text-[11px] text-ink truncate">Google Prep</span>
              </div>
              <span className="text-muted flex items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {/* Upcoming rounds section */}
              <div>
                <p className="px-1 text-[8px] font-bold uppercase tracking-wider text-muted">Upcoming Rounds</p>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-ink bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-muted">
                      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                    <span className="truncate">Coding Prep</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted hover:bg-surface/50 transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-muted">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    <span className="truncate">System Design</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted hover:bg-surface/50 transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-muted">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="truncate">Behavioral Loop</span>
                  </div>
                </div>
              </div>

              {/* AI Agents section */}
              <div>
                <p className="px-1 text-[8px] font-bold uppercase tracking-wider text-muted">AI Agents</p>
                <div className="mt-1.5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted hover:bg-surface/50 transition">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[9px]">TP</span>
                    <span className="truncate">Task Planner</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted hover:bg-surface/50 transition">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[9px]">CC</span>
                    <span className="truncate">Coding Coach</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted hover:bg-surface/50 transition">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[9px]">BG</span>
                    <span className="truncate">Behavioral Guide</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-2 border-t border-line">
              <button
                type="button"
                className={`w-full flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-medium text-muted border border-dashed border-line hover:bg-surface hover:text-ink transition-all cursor-pointer ${
                  activeCard === "new_chat" ? "ring-2 ring-ink text-ink bg-surface scale-[1.05]" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>New chat</span>
              </button>
            </div>
          </aside>

          {/* Main Workspace */}
          <div className="min-w-0 flex-1 bg-surface p-4 sm:p-5">
            {/* Top workspace bar */}
            <div className="flex items-center justify-between gap-3 border-b border-line pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-b from-[#3b3b41] to-[#161619] text-white shadow-sm font-bold text-[11px] sheen">
                  G
                </span>
                <div className="min-w-0">
                  <h2 className="text-[13px] font-bold text-ink sm:text-sm truncate">Google SDE II Prep</h2>
                  <p className="text-[9px] text-muted truncate">Workspace / Targets</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-medium text-muted border border-line rounded px-1.5 py-0.5 bg-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-2.5 w-2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Private
                </span>
                <span className="h-6 w-6 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] sheen" />
              </div>
            </div>

            {/* Tabs Row */}
            <div className="mt-2.5 flex items-center justify-between border-b border-line/60">
              <div className="flex gap-4 text-[10px] font-semibold text-muted">
                <span className="border-b-2 border-ink py-1.5 text-ink cursor-default">Rounds</span>
                <span className="py-1.5 hover:text-ink transition cursor-default">Study Plan</span>
                <span className="py-1.5 hover:text-ink transition cursor-default">Target Roles</span>
                <span className="py-1.5 hover:text-ink transition cursor-default">Timeline</span>
              </div>
              <div className="flex items-center gap-2.5 pb-1.5">
                <span className="text-[9px] font-semibold text-muted hover:text-ink cursor-pointer">Filter</span>
                <span className="text-[9px] font-semibold text-muted hover:text-ink cursor-pointer">Sort</span>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {columns.map((column) => (
                <div key={column.title} className="flex flex-col gap-2.5">
                  {/* Column Header */}
                  <div className="flex items-center justify-between px-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: column.bulletColor }}
                      />
                      <span className="text-[10px] font-bold text-ink truncate">{column.title}</span>
                      <span className="text-[9px] font-bold text-muted bg-subtle px-1.5 py-0.2 rounded-full">
                        {column.cards.length}
                      </span>
                    </div>
                    <button type="button" className="text-muted hover:text-ink">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  {/* Cards stack */}
                  <div className="flex flex-col gap-2.5">
                    {column.cards.map((card) => {
                      const isActive = activeCard === card.id;
                      return (
                        <div
                          key={card.id}
                          className={`rounded-xl border border-line bg-card p-3.5 shadow-[0_1px_2.5px_rgba(0,0,0,0.03)] flex flex-col gap-1.5 transition-all duration-500 hover:border-muted cursor-default will-change-transform ${
                            isActive
                              ? "ring-2 ring-ink scale-[1.04] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.15)] z-10"
                              : ""
                          }`}
                        >
                          <p className="text-[10px] font-semibold text-ink leading-snug">{card.title}</p>
                          
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {card.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[8px] px-1.5 py-0.5 rounded bg-subtle text-ink-soft font-semibold"
                              >
                                {tag}
                              </span>
                            ))}
                            {card.priority && (
                              <span
                                className={`text-[8px] px-1.5 py-0.5 rounded font-semibold ${
                                  card.priority === "High"
                                    ? "bg-red-500/10 text-red-500"
                                    : "bg-gray-500/10 text-muted"
                                }`}
                              >
                                {card.priority}
                              </span>
                            )}
                            {card.passed && (
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400 font-bold flex items-center gap-0.5">
                                <span>✓</span> {card.score}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
