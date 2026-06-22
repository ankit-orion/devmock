"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  Coding: "#a78bfa",
  "System Design": "#f5a97f",
  Behavioral: "#7aa2f7",
};

const overall = 82;
const verdict = "Strong — likely to advance to the next round";
const summary =
  "You demonstrated solid coding fundamentals and clear communication. Your system-design answer was on the right track but needs more depth on scaling and trade-offs. Behavioral responses were well-structured; quantify your impact more.";

const categories = [
  { label: "Coding", value: 88, color: "#a78bfa" },
  { label: "System Design", value: 72, color: "#f5a97f" },
  { label: "Behavioral", value: 84, color: "#7aa2f7" },
  { label: "Communication", value: 90, color: "#5bc0c0" },
];

const strengths = [
  "Clear, structured problem-solving approach",
  "Strong data-structure choices under time pressure",
  "Concise, confident communication",
];

const improvements = [
  "Add depth on scalability trade-offs (sharding, caching)",
  "Always call out edge cases before coding",
  "Quantify impact in behavioral stories",
];

type RoundResult = {
  name: string;
  type: string;
  score: number;
  questions: { q: string; tests: string; note: string }[];
};

const rounds: RoundResult[] = [
  {
    name: "Online Assessment",
    type: "Coding",
    score: 85,
    questions: [
      {
        q: "Return the indices of the two numbers that add up to a target.",
        tests: "Arrays · Hash Maps",
        note: "Correct hash-map solution in O(n). Missed mentioning duplicate/empty-input edge cases.",
      },
    ],
  },
  {
    name: "System Design",
    type: "System Design",
    score: 72,
    questions: [
      {
        q: "Design a URL shortener that handles 100M requests/day.",
        tests: "Scalability · Caching",
        note: "Good API and base62 ID scheme. Needed more on partitioning, cache invalidation and rate limiting.",
      },
    ],
  },
  {
    name: "Behavioral (Bar Raiser)",
    type: "Behavioral",
    score: 84,
    questions: [
      {
        q: "Tell me about a time you took ownership outside your scope.",
        tests: "Ownership · Dive Deep",
        note: "Clear STAR structure and ownership shown. Add measurable outcomes to strengthen impact.",
      },
    ],
  },
];

function useCountUp(target: number, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function Scorecard({ sessionId }: { sessionId: string }) {
  void sessionId;
  const score = useCountUp(overall);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8bd5a0]" />
            Scorecard
          </span>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink">
            Amazon · SDE II
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Mock interview · 3 rounds · just now</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
          Export PDF
        </button>
      </div>

      {/* Overall score */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl border border-line bg-card p-6 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)] sm:flex-row">
        <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa]/15 to-[#7aa2f7]/15 ring-1 ring-line">
          <span className="font-serif text-4xl font-medium leading-none text-ink">{score}</span>
          <span className="mt-1 text-[11px] text-muted">out of 100</span>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-ink">{verdict}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{summary}</p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="mt-5 rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
        <h2 className="text-sm font-semibold text-ink">Category breakdown</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {categories.map((c) => (
            <div key={c.label}>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-soft">{c.label}</span>
                <span className="text-xs font-medium text-muted">{c.value}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-out"
                  style={{ width: mounted ? `${c.value}%` : "0%", background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & improvements */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="text-[#16a34a]">✓</span> Strengths
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {strengths.map((s) => (
              <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8bd5a0]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="text-[#d97706]">Δ</span> To improve
          </h3>
          <ul className="mt-3 flex flex-col gap-2">
            {improvements.map((s) => (
              <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a97f]" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-round breakdown / transcript */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-ink">Round breakdown</h2>
        <div className="mt-3 flex flex-col gap-3">
          {rounds.map((r, i) => {
            const isOpen = open === i;
            const color = TYPE_COLORS[r.type] ?? "#9a9aa3";
            return (
              <div key={r.name} className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: color }}>
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-[11px] text-muted">{r.type}</p>
                  </div>
                  <span className="text-sm font-semibold text-ink">{r.score}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-line px-4 py-3.5">
                    {r.questions.map((q) => (
                      <div key={q.q} className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                            style={{ background: `${color}22`, color }}
                          >
                            {q.tests}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium text-ink">{q.q}</p>
                        <p className="rounded-lg bg-surface px-3 py-2 text-[12px] leading-relaxed text-ink-soft">
                          {q.note}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard"
          className="rounded-full border border-line bg-card px-5 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          Back to dashboard
        </Link>
        <Link
          href="/interview/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-3 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
        >
          Practice again
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" /></svg>
        </Link>
      </div>
    </div>
  );
}
