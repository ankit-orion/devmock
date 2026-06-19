import { Logo } from "@/components/ui/Logo";
import { DemoTriggerButton } from "./demo/DemoTriggerButton";

const navItems = [
  { label: "Dashboard", active: true, icon: "M3 11l9-7 9 7v8a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { label: "Interviews", icon: "M4 5h16v11H7l-3 3z" },
  { label: "Practice", icon: "M12 4v16M4 12h16" },
  { label: "Resume", icon: "M7 3h7l4 4v14H7z M14 3v4h4" },
  { label: "Reports", icon: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

const sessions = [
  { company: "Amazon", role: "SDE II", score: 82, tone: "#a78bfa", status: "Completed", sColor: "#16a34a" },
  { company: "Google", role: "Frontend Engineer", score: 76, tone: "#7aa2f7", status: "Completed", sColor: "#16a34a" },
  { company: "Meta", role: "E4 Product Eng", score: null, tone: "#f5a97f", status: "In progress", sColor: "#d97706" },
  { company: "Stripe", role: "Backend Engineer", score: 88, tone: "#8bd5a0", status: "Completed", sColor: "#16a34a" },
];

const skills = [
  { label: "Data Structures", value: 80, color: "#a78bfa" },
  { label: "System Design", value: 62, color: "#7aa2f7" },
  { label: "Behavioral", value: 74, color: "#f5a97f" },
  { label: "Communication", value: 88, color: "#8bd5a0" },
];

export function HeroDashboard() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-30px_rgba(20,20,40,0.35)]">
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden w-44 shrink-0 flex-col border-r border-line bg-[#fbfbfc] p-3 sm:flex">
            <div className="px-1 py-1.5">
              <Logo size={22} />
            </div>
            <nav className="mt-4 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <span
                  key={item.label}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium ${
                    item.active
                      ? "bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-line"
                      : "text-muted"
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </span>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-0.5 border-t border-line pt-2">
              <span className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[11px] font-medium text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></svg>
                Settings
              </span>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            {/* Top bar */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-ink sm:text-sm">
                  Hello, Aditya 👋
                </p>
                <p className="text-[10px] text-muted">
                  You have 1 interview in progress
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3 py-1.5 text-[10px] font-medium text-white sheen">
                  + New interview
                </span>
                <span className="h-7 w-7 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7aa2f7]" />
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { label: "Interviews", value: "12", sub: "+3 this week", accent: "#a78bfa" },
                { label: "Avg. score", value: "78", sub: "Top 14%", accent: "#7aa2f7" },
                { label: "Day streak", value: "5", sub: "Keep going", accent: "#f5a97f" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-line bg-[#fbfbfc] p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: stat.accent }} />
                    <span className="text-[9px] font-medium uppercase tracking-wide text-muted">{stat.label}</span>
                  </div>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{stat.value}</p>
                  <p className="text-[9px] text-muted">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Two columns */}
            <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-5">
              {/* Recent sessions */}
              <div className="rounded-xl border border-line bg-white p-3 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-ink">Recent sessions</p>
                  <span className="text-[9px] text-muted">View all</span>
                </div>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {sessions.map((s) => (
                    <div key={s.company} className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 hover:bg-[#fbfbfc]">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md text-[9px] font-bold text-white" style={{ background: s.tone }}>
                        {s.company[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-ink">{s.company}</p>
                        <p className="truncate text-[9px] text-muted">{s.role}</p>
                      </div>
                      <span className="text-[10px] font-semibold text-ink">
                        {s.score !== null ? s.score : "—"}
                      </span>
                      <span className="w-14 text-right text-[8px] font-medium" style={{ color: s.sColor }}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill breakdown */}
              <div className="rounded-xl border border-line bg-white p-3 lg:col-span-2">
                <p className="text-[11px] font-semibold text-ink">Skill breakdown</p>
                <div className="mt-3 flex flex-col gap-2.5">
                  {skills.map((sk) => (
                    <div key={sk.label}>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-ink-soft">{sk.label}</span>
                        <span className="text-[9px] font-medium text-muted">{sk.value}%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#efeff2]">
                        <div className="h-full rounded-full" style={{ width: `${sk.value}%`, background: sk.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watch demo overlay */}
      <DemoTriggerButton variant="hero" />
    </div>
  );
}
