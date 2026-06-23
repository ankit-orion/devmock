"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TYPE_COLORS: Record<string, string> = {
  CODING: "#a78bfa",
  SYSTEM_DESIGN: "#f5a97f",
  BEHAVIORAL: "#7aa2f7",
  MIXED: "#5bc0c0",
};
const CAT_PALETTE = ["#a78bfa", "#7aa2f7", "#f5a97f", "#5bc0c0", "#8bd5a0", "#efd97a"];

type ScorecardData = {
  company: string | null;
  role: string;
  overallScore: number;
  verdict: string;
  summary: string;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  rounds: { name: string; type: string; score: number | null; questions: { q: string; tests: string | null; note: string }[] }[];
};

function useCountUp(target: number, active: boolean, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, ms]);
  return v;
}

export function Scorecard({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<ScorecardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}/complete`, { method: "POST" });
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Could not generate scorecard");
        const json = await res.json();
        if (!cancelled) setData(json.scorecard as ScorecardData);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const score = useCountUp(data?.overallScore ?? 0, !!data);

  if (error) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-ink-soft">{error}</p>
        <Link href="/dashboard" className="mt-4 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">Back to dashboard</Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <span className="h-9 w-9 rounded-full border-[3px] border-line border-t-[#a78bfa] demo-spin" />
        <p className="mt-4 text-sm font-medium text-ink">Generating your scorecard…</p>
        <p className="mt-1 text-xs text-muted">Reviewing every round and answer</p>
      </div>
    );
  }

  const categories = Object.entries(data.categoryScores ?? {});

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
            {data.company ? `${data.company} · ` : ""}{data.role}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">Mock interview · {data.rounds.length} rounds</p>
        </div>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" /></svg>
          Export PDF
        </button>
      </div>

      {/* Overall */}
      <div className="mt-6 flex flex-col items-center gap-5 rounded-2xl border border-line bg-card p-6 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)] sm:flex-row">
        <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa]/15 to-[#7aa2f7]/15 ring-1 ring-line">
          <span className="font-serif text-4xl font-medium leading-none text-ink">{score}</span>
          <span className="mt-1 text-[11px] text-muted">out of 100</span>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-ink">{data.verdict}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{data.summary}</p>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mt-5 rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
          <h2 className="text-sm font-semibold text-ink">Category breakdown</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {categories.map(([label, value], i) => (
              <div key={label}>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-soft">{label}</span>
                  <span className="text-xs font-medium text-muted">{value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-subtle">
                  <div className="h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${value}%`, background: CAT_PALETTE[i % CAT_PALETTE.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths / improvements */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="text-[#16a34a]">✓</span> Strengths</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {data.strengths.map((s) => (
              <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8bd5a0]" />{s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><span className="text-[#d97706]">Δ</span> To improve</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {data.improvements.map((s) => (
              <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-ink-soft"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5a97f]" />{s}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Round breakdown */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-ink">Round breakdown</h2>
        <div className="mt-3 flex flex-col gap-3">
          {data.rounds.map((r, i) => {
            const isOpen = open === i;
            const color = TYPE_COLORS[r.type] ?? "#9a9aa3";
            return (
              <div key={`${r.name}-${i}`} className="overflow-hidden rounded-2xl border border-line bg-card shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: color }}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <p className="text-[11px] text-muted">{r.type.replace("_", " ")}</p>
                  </div>
                  {r.score != null && <span className="text-sm font-semibold text-ink">{r.score}</span>}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`h-4 w-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-3 border-t border-line px-4 py-3.5">
                    {r.questions.map((q, qi) => (
                      <div key={qi} className="flex flex-col gap-2">
                        {q.tests && <span className="self-start rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${color}22`, color }}>{q.tests}</span>}
                        <p className="text-[13px] font-medium text-ink">{q.q}</p>
                        <p className="rounded-lg bg-surface px-3 py-2 text-[12px] leading-relaxed text-ink-soft">{q.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/dashboard" className="rounded-full border border-line bg-card px-5 py-3 text-center text-sm font-medium text-ink transition-colors hover:bg-surface">Back to dashboard</Link>
        <Link href="/interview/new" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-3 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]">
          Practice again
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15" /></svg>
        </Link>
      </div>
    </div>
  );
}
