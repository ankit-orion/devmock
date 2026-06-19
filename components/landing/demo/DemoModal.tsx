"use client";

import { useEffect, useState } from "react";

const STEP_MS = 5200;

const steps = [
  {
    id: "setup",
    label: "Set up",
    title: "Tell devmock about your interview",
    desc: "Pick a company or paste a job description, and add your resume.",
  },
  {
    id: "plan",
    label: "Plan",
    title: "AI designs your interview rounds",
    desc: "devmock recreates the real interview loop — round by round.",
  },
  {
    id: "interview",
    label: "Interview",
    title: "Practice with adaptive questions",
    desc: "Answer questions and get follow-ups, just like the real thing.",
  },
  {
    id: "scorecard",
    label: "Feedback",
    title: "Get a detailed scorecard",
    desc: "See your score, your strengths, and exactly what to improve.",
  },
];

/* Count a number up to `target` with easeOutCubic when `active`. */
function useCountUp(target: number, active: boolean, ms = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return value;
}

function fade(delay: number) {
  return { animationDelay: `${delay}ms` } as const;
}

/* ---------------- Step visuals ---------------- */

function SetupStep() {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      <div className="demo-fade-up rounded-xl border border-line bg-white p-3" style={fade(0)}>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Company</p>
        <div className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-[#fbfbfc] px-2.5 py-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#a78bfa] text-[9px] font-bold text-white">A</span>
          <span className="text-sm font-medium text-ink">Amazon</span>
          <span className="ml-auto h-3.5 w-px animate-pulse bg-ink/40" />
        </div>
      </div>

      <div className="demo-fade-up rounded-xl border border-line bg-white p-3" style={fade(220)}>
        <p className="text-[10px] font-medium uppercase tracking-wide text-muted">Role</p>
        <div className="mt-1 rounded-lg border border-line bg-[#fbfbfc] px-2.5 py-2 text-sm font-medium text-ink">
          SDE II
        </div>
      </div>

      <div className="demo-fade-up flex items-center gap-2 rounded-xl border border-dashed border-[#7aa2f7]/40 bg-[#7aa2f7]/5 px-3 py-2.5" style={fade(440)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-[#7aa2f7]"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>
        <span className="text-xs font-medium text-ink">aditya_resume.pdf</span>
        <span className="ml-auto text-[10px] font-semibold text-[#16a34a]">Uploaded ✓</span>
      </div>

      <div className="demo-fade-up flex justify-center pt-1" style={fade(640)}>
        <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-xs font-medium text-white sheen">
          Generate Plan
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </span>
      </div>
    </div>
  );
}

function PlanStep() {
  const rounds = [
    { n: "Online Assessment", t: "Coding · 2 questions", c: "#a78bfa" },
    { n: "Phone Screen", t: "Behavioral · 3 questions", c: "#7aa2f7" },
    { n: "Onsite — System Design", t: "Design · 1 question", c: "#f5a97f" },
    { n: "Bar Raiser", t: "Leadership · 3 questions", c: "#8bd5a0" },
  ];
  return (
    <div className="mx-auto max-w-sm">
      <div className="demo-fade-up mb-3 flex items-center justify-center gap-2 text-xs text-muted" style={fade(0)}>
        <span className="h-3.5 w-3.5 rounded-full border-2 border-line border-t-[#a78bfa] demo-spin" />
        Building your Amazon SDE II loop…
      </div>
      <div className="space-y-2">
        {rounds.map((r, i) => (
          <div
            key={r.n}
            className="demo-fade-up flex items-center gap-3 rounded-xl border border-line bg-white px-3 py-2.5"
            style={fade(300 + i * 260)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white" style={{ background: r.c }}>
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{r.n}</p>
              <p className="truncate text-[11px] text-muted">{r.t}</p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto h-4 w-4 text-[#16a34a]"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterviewStep() {
  return (
    <div className="mx-auto max-w-md space-y-3">
      <div className="demo-fade-up flex items-center justify-between" style={fade(0)}>
        <span className="text-[11px] font-medium text-ink">Round 3 of 5 · System Design</span>
        <span className="rounded-md bg-white px-2 py-0.5 font-mono text-[10px] text-ink-soft ring-1 ring-line">24:13</span>
      </div>

      <div className="demo-fade-up flex gap-2.5" style={fade(250)}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[10px] font-bold text-white sheen">AI</span>
        <div className="rounded-xl rounded-tl-sm bg-[#f1f0f4] px-3 py-2 text-[12px] leading-snug text-ink">
          Design a URL shortener that handles 100M requests per day.
        </div>
      </div>

      <div className="demo-fade-up flex justify-end" style={fade(1100)}>
        <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3 py-2 text-[12px] leading-snug text-white/90">
          I&apos;d use a base62 ID generator with a Redis cache in front of the DB.
        </div>
      </div>

      <div className="demo-fade-up flex gap-2.5" style={fade(2100)}>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[10px] font-bold text-white sheen">AI</span>
        <div className="rounded-xl rounded-tl-sm bg-[#f1f0f4] px-3 py-2 text-[12px] leading-snug text-ink">
          Good. How would you handle cache invalidation under heavy writes?
        </div>
      </div>

      <div className="demo-fade-up flex items-center gap-2 rounded-xl border border-line bg-[#fbfbfc] px-3 py-2" style={fade(3000)}>
        <span className="text-[11px] font-semibold text-ink">Live feedback</span>
        <span className="rounded-full bg-[#8bd5a0]/15 px-2 py-0.5 text-[10px] font-bold text-[#16a34a]">8 / 10</span>
        <span className="ml-auto rounded-md bg-[#f5a97f]/15 px-1.5 py-0.5 text-[9px] font-medium text-[#d97706]">Δ Add rate limiting</span>
      </div>
    </div>
  );
}

function ScorecardStep({ active }: { active: boolean }) {
  const score = useCountUp(82, active, 1300);
  const cats = [
    { label: "Coding", value: 88, color: "#a78bfa" },
    { label: "System Design", value: 72, color: "#7aa2f7" },
    { label: "Behavioral", value: 80, color: "#f5a97f" },
    { label: "Communication", value: 90, color: "#8bd5a0" },
  ];
  return (
    <div className="mx-auto max-w-md">
      <div className="demo-fade-up flex items-center gap-4 rounded-2xl border border-line bg-white p-4" style={fade(0)}>
        <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa]/15 to-[#7aa2f7]/15 ring-1 ring-line">
          <span className="font-serif text-3xl font-medium leading-none text-ink">{score}</span>
          <span className="text-[9px] text-muted">/ 100</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Strong performance</p>
          <p className="mt-0.5 text-xs leading-5 text-ink-soft">
            You&apos;d likely advance to the next round. Tighten up system-design depth.
          </p>
        </div>
      </div>

      <div className="demo-fade-up mt-3 rounded-2xl border border-line bg-white p-4" style={fade(220)}>
        <p className="mb-3 text-[11px] font-semibold text-ink">Category breakdown</p>
        <div className="space-y-2.5">
          {cats.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-ink-soft">{c.label}</span>
                <span className="text-[11px] font-medium text-muted">{c.value}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#efeff2]">
                <div className="demo-bar h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-fade-up mt-3 flex flex-wrap gap-1.5" style={fade(440)}>
        <span className="rounded-md bg-[#8bd5a0]/15 px-2 py-1 text-[10px] font-medium text-[#16a34a]">+ Clear communication</span>
        <span className="rounded-md bg-[#8bd5a0]/15 px-2 py-1 text-[10px] font-medium text-[#16a34a]">+ Strong DSA</span>
        <span className="rounded-md bg-[#f5a97f]/15 px-2 py-1 text-[10px] font-medium text-[#d97706]">Δ Scalability trade-offs</span>
      </div>
    </div>
  );
}

/* ---------------- Modal shell ---------------- */

export function DemoModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);

  // reset whenever it opens
  useEffect(() => {
    if (open) {
      setActive(0);
      setPlaying(true);
    }
  }, [open]);

  // auto-advance
  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(
      () => setActive((s) => (s + 1) % steps.length),
      STEP_MS,
    );
    return () => clearTimeout(t);
  }, [open, playing, active]);

  // body scroll lock + esc to close
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const go = (n: number) => setActive((n + steps.length) % steps.length);
  const current = steps[active];

  return (
    <div
      className="demo-overlay-in fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="How devmock works"
    >
      <div
        className="demo-panel-in flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="border-b border-line px-5 pt-4 pb-3 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
                How it works · Step {active + 1} of {steps.length}
              </p>
              <h3 className="mt-1 font-serif text-xl font-medium tracking-tight text-ink sm:text-2xl">
                {current.title}
              </h3>
              <p className="mt-1 text-xs leading-5 text-ink-soft">{current.desc}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close demo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-white text-ink-soft transition-colors hover:bg-[#fbfbfc] hover:text-ink"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>

          {/* progress segments */}
          <div className="mt-3 flex gap-1.5">
            {steps.map((s, i) => (
              <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                {i < active ? (
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#7aa2f7]" />
                ) : i === active ? (
                  <div
                    key={`prog-${active}`}
                    className="demo-progress h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#7aa2f7]"
                    style={{
                      animationDuration: `${STEP_MS}ms`,
                      animationPlayState: playing ? "running" : "paused",
                    }}
                  />
                ) : (
                  <div className="h-full w-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* stage */}
        <div className="flex min-h-[320px] flex-1 items-center justify-center overflow-y-auto bg-[#faf9fb] px-5 py-6 sm:min-h-[360px] sm:px-6">
          <div key={current.id} className="w-full">
            {active === 0 && <SetupStep />}
            {active === 1 && <PlanStep />}
            {active === 2 && <InterviewStep />}
            {active === 3 && <ScorecardStep active={active === 3} />}
          </div>
        </div>

        {/* controls */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => go(active - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:bg-[#fbfbfc] hover:text-ink"
            aria-label="Previous step"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><path d="M15 6l-6 6 6 6" /></svg>
          </button>

          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${s.label}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-ink" : "w-2 bg-line hover:bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:bg-[#fbfbfc] hover:text-ink"
            >
              {playing ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-3.5 w-3.5"><path d="M8 5v14l11-7z" /></svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              className="flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3 text-xs font-medium text-white sheen"
              aria-label="Next step"
            >
              {active === steps.length - 1 ? "Replay" : "Next"}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
