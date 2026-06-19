import { DemoTriggerButton } from "./demo/DemoTriggerButton";

type Feature = {
  title: string;
  desc: string;
  icon: string;
};

const leftFeatures: Feature[] = [
  {
    title: "Company-specific rounds",
    desc: "A real company loop, recreated round by round.",
    icon: "M3 7h18M3 12h18M3 17h18",
  },
  {
    title: "Resume-based questions",
    desc: "Get grilled on the actual projects on your CV.",
    icon: "M7 3h7l4 4v14H7zM14 3v4h4",
  },
  {
    title: "Live code execution",
    desc: "Run your solution in a sandbox, mid-interview.",
    icon: "M8 9l-3 3 3 3M16 9l3 3-3 3",
  },
];

const rightFeatures: Feature[] = [
  {
    title: "Real-time feedback",
    desc: "Every answer scored with strengths and gaps.",
    icon: "M20 6L9 17l-5-5",
  },
  {
    title: "Adaptive follow-ups",
    desc: "It probes deeper exactly where you're weak.",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    title: "Detailed scorecards",
    desc: "A full report card at the end of every session.",
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
];

function FeatureLabel({
  feature,
  align,
}: {
  feature: Feature;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex items-start gap-3 ${
        align === "right" ? "lg:flex-row-reverse lg:text-right" : ""
      }`}
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-white shadow-[0_4px_10px_-6px_rgba(0,0,0,0.3)]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-ink">
          <path d={feature.icon} />
        </svg>
      </span>
      <div>
        <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
        <p className="mt-1 text-xs leading-5 text-ink-soft">{feature.desc}</p>
      </div>
    </div>
  );
}

function SessionMock() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_80px_-30px_rgba(20,20,40,0.45)]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-line bg-[#fbfbfc] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#f5a97f]" />
            <span className="text-[11px] font-medium text-ink">
              Round 3 of 5 · System Design
            </span>
          </div>
          <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] text-ink-soft ring-1 ring-line">
            24:13
          </span>
        </div>

        {/* progress */}
        <div className="flex gap-1 px-4 pt-3">
          {[100, 100, 60, 0, 0].map((p, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-[#efeff2]">
              <div className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#7aa2f7]" style={{ width: `${p}%` }} />
            </div>
          ))}
        </div>

        <div className="space-y-3 p-4">
          {/* question */}
          <div className="flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[10px] font-bold text-white sheen">
              AI
            </span>
            <div className="rounded-xl rounded-tl-sm bg-[#f1f0f4] px-3 py-2">
              <p className="text-[11px] leading-snug text-ink">
                Design a URL shortener that handles 100M requests per day.
                Start with the API and data model.
              </p>
            </div>
          </div>

          {/* code editor */}
          <div className="overflow-hidden rounded-xl border border-line bg-[#1a1a1e]">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-[#f5a97f]" />
              <span className="h-2 w-2 rounded-full bg-[#efd97a]" />
              <span className="h-2 w-2 rounded-full bg-[#8bd5a0]" />
              <span className="ml-2 font-mono text-[9px] text-white/40">solution.ts</span>
            </div>
            <pre className="px-3 py-2 font-mono text-[9px] leading-relaxed text-white/80">
              <span className="text-[#a78bfa]">POST</span> /shorten {"{"} url {"}"}
              {"\n"}<span className="text-[#7aa2f7]">→</span> id = base62(counter++)
              {"\n"}<span className="text-[#7aa2f7]">→</span> cache.set(id, url, ttl)
            </pre>
          </div>

          {/* feedback */}
          <div className="rounded-xl border border-line bg-[#fbfbfc] p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-ink">Live feedback</span>
              <span className="rounded-full bg-[#8bd5a0]/15 px-2 py-0.5 text-[9px] font-bold text-[#16a34a]">
                8 / 10
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1">
              <span className="rounded-md bg-[#8bd5a0]/15 px-1.5 py-0.5 text-[8px] font-medium text-[#16a34a]">+ Clear API design</span>
              <span className="rounded-md bg-[#f5a97f]/15 px-1.5 py-0.5 text-[8px] font-medium text-[#d97706]">Δ Add rate limiting</span>
            </div>
          </div>
        </div>
      </div>

      <DemoTriggerButton variant="compact" />
    </div>
  );
}

export function Solution() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="dot-grid relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-white to-[#f7f6f9] px-5 py-12 sm:rounded-[28px] sm:px-10 sm:py-14">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]" />
            The Solution
          </span>
          <h2 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Interview Prep, Reinvented
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-8">
          {/* desktop: left flanking labels */}
          <div className="hidden flex-col gap-8 lg:col-span-3 lg:flex">
            {leftFeatures.map((f) => (
              <FeatureLabel key={f.title} feature={f} align="left" />
            ))}
          </div>

          {/* central mock (first on mobile) */}
          <div className="order-first lg:order-none lg:col-span-6">
            <SessionMock />
          </div>

          {/* desktop: right flanking labels */}
          <div className="hidden flex-col gap-8 lg:col-span-3 lg:flex">
            {rightFeatures.map((f) => (
              <FeatureLabel key={f.title} feature={f} align="right" />
            ))}
          </div>

          {/* mobile + tablet: all features in a responsive grid below the mock */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
            {[...leftFeatures, ...rightFeatures].map((f) => (
              <FeatureLabel key={f.title} feature={f} align="left" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
