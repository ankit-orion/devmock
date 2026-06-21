"use client";

import { Logo } from "@/components/ui/Logo";
import { BrandMark, type BrandName } from "@/components/ui/BrandMark";
import { useReveal } from "./useReveal";

function BrandChip({
  name,
  className = "",
}: {
  name: BrandName;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-line bg-card px-3.5 py-2.5 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.3)] ${className}`}
    >
      <BrandMark name={name} iconClassName="text-ink" />
    </div>
  );
}

function Diagram({ revealed }: { revealed: boolean }) {
  return (
    <>
      {/* desktop diagram */}
      <div className={`relative mx-auto hidden h-[280px] w-full max-w-2xl md:block ${revealed ? "revealed" : ""}`}>
        {/*
          Elbow/junction connectors: each chip routes horizontally inward, bends
          with a rounded corner to a shared vertical at x=40 (left) / x=60 (right),
          meets at mid-height, then runs into the center logo.
          The chips (z-10, solid bg) and logo (z-20, solid bg) sit ABOVE this SVG
          and mask the path ends, so each elbow connects cleanly edge-to-edge.
          With preserveAspectRatio="none", a CSS `left-X% top-Y%` point maps exactly
          to SVG coordinate (X, Y) — so centering each chip on the point its path
          starts from guarantees alignment.
        */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-line"
          aria-hidden
        >
          {[
            { d: "M 16 26 H 38 Q 40 26 40 28 V 48 Q 40 50 42 50 H 50", delay: "" },
            { d: "M 16 74 H 38 Q 40 74 40 72 V 52 Q 40 50 42 50 H 50", delay: "delay-line-1" },
            { d: "M 84 26 H 62 Q 60 26 60 28 V 48 Q 60 50 58 50 H 50", delay: "delay-line-2" },
            { d: "M 84 74 H 62 Q 60 74 60 72 V 52 Q 60 50 58 50 H 50", delay: "delay-line-3" },
          ].map((l, i) => (
            <path
              key={i}
              d={l.d}
              fill="none"
              pathLength={1}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className={`diagram-line ${l.delay}`}
            />
          ))}
        </svg>

        {/* brand chips — centered on the line endpoints, solid bg masks the line */}
        <BrandChip
          name="Amazon"
          className="absolute left-[16%] top-[26%] z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
        />
        <BrandChip
          name="Google"
          className="absolute left-[16%] top-[74%] z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
        />
        <BrandChip
          name="Meta"
          className="absolute left-[84%] top-[26%] z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
        />
        <BrandChip
          name="Microsoft"
          className="absolute left-[84%] top-[74%] z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105"
        />

        {/* center logo — masks the converging line ends */}
        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 logo-center-glow">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-3.5 shadow-xl sheen">
            <Logo tone="white" size={24} />
          </div>
        </div>
      </div>

      {/* mobile fallback */}
      <div className="md:hidden flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <BrandChip name="Amazon" />
          <BrandChip name="Google" />
        </div>
        <div className="relative">
          <div className="h-8 w-px bg-line" />
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-3 sheen">
            <Logo tone="white" size={20} />
          </div>
          <div className="h-8 w-px bg-line mx-auto" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <BrandChip name="Meta" />
          <BrandChip name="Microsoft" />
        </div>
      </div>
    </>
  );
}

const features = [
  {
    label: "Company-specific rounds",
    icon: "M3 7h18M3 12h18M3 17h18",
    desc: "Pick a company and devmock recreates its real interview loop, including rounds, focus areas and format.",
    preview: (
      <div className="flex flex-col gap-2 p-1">
        {[
          { n: "Online Assessment", t: "Coding", c: "var(--c-ink)" },
          { n: "Phone Screen", t: "Behavioral", c: "var(--c-ink-soft)" },
          { n: "Onsite: System Design", t: "Design", c: "var(--c-muted)" },
          { n: "Bar Raiser", t: "Leadership", c: "#52525b" },
        ].map((r) => (
          <div
            key={r.n}
            className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 shadow-sm transition-all hover:bg-card"
          >
            <span className="h-2 w-2 rounded-full" style={{ background: r.c }} />
            <span className="flex-1 truncate text-[11px] font-semibold text-ink">
              {r.n}
            </span>
            <span className="rounded-md bg-page px-1.5 py-0.5 text-[8px] font-medium text-muted">
              {r.t}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Adaptive follow-ups",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    desc: "Answer well and it digs deeper. The AI reads each response and probes exactly where you're weak.",
    preview: (
      <div className="flex flex-col gap-2.5 p-1">
        <div className="max-w-[85%] self-start rounded-2xl rounded-tl-sm bg-subtle px-3.5 py-2 text-[10px] leading-relaxed text-ink-soft shadow-sm">
          Walk me through your caching approach.
        </div>
        <div className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3.5 py-2 text-[10px] leading-relaxed text-white/90 shadow-md">
          I used Redis with a TTL...
        </div>
        <div className="max-w-[90%] self-start rounded-2xl rounded-tl-sm bg-subtle px-3.5 py-2 text-[10px] leading-relaxed text-ink-soft shadow-sm">
          Good. How would you handle cache invalidation under high write load?
        </div>
      </div>
    ),
  },
  {
    label: "Resume-based questions",
    icon: "M7 3h7l4 4v14H7zM14 3v4h4",
    desc: "Upload your resume and get grilled on your actual projects, tech choices and trade-offs.",
    preview: (
      <div className="flex flex-col gap-2.5 p-1">
        <div className="rounded-xl border border-line bg-surface p-2.5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-ink">Realtime Chat App</p>
              <p className="mt-0.5 text-[8px] text-muted">WebSockets · Redis · Node.js</p>
            </div>
            <span className="rounded-full bg-subtle px-2 py-0.5 text-[8px] font-semibold text-ink-soft">
              Featured
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-dashed border-line bg-surface p-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1 bg-ink-soft" />
          <p className="text-[10px] leading-relaxed text-ink-soft italic pl-1">
            &ldquo;You used WebSockets here: how did you handle dropped
            connections and message ordering?&rdquo;
          </p>
        </div>
      </div>
    ),
  },
];

export function Integrations() {
  const [revealRef, revealed] = useReveal();

  return (
    <section id="product" ref={revealRef} className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className={`text-center mb-10 reveal-fade-up ${revealed ? "revealed" : ""}`}>
        <h2 className="mx-auto max-w-2xl font-serif text-3xl font-medium leading-[1.12] tracking-tight text-ink sm:text-4xl">
          Practice the interview you&apos;re actually walking into
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-soft">
          Pick a company you&apos;re targeting, and devmock recreates the
          interview behind the scenes.
        </p>
      </div>

      <div className="mt-12">
        <Diagram revealed={revealed} />
      </div>

      <div className="mt-0 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.label}
            className={`group rounded-2xl border border-line bg-surface/30 p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:-translate-y-1 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch reveal-fade-up ${
              revealed ? "revealed" : ""
            } ${
              i === 0 ? "delay-300" : i === 1 ? "delay-500" : "delay-700"
            }`}
          >
            <div className="flex-1 flex flex-col rounded-xl border border-line bg-card p-4.5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-line bg-surface shadow-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-ink"
                    >
                      <path d={f.icon} />
                    </svg>
                  </span>
                  <h3 className="text-sm font-bold text-ink">{f.label}</h3>
                </div>
                <p className="mt-3 text-xs leading-5 text-ink-soft">{f.desc}</p>
              </div>
              <div className="mt-5 rounded-xl border border-line bg-surface p-3 shadow-inner">
                {f.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
