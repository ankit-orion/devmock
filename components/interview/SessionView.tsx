"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CodeEditor } from "./CodeEditor";

const TYPE_COLORS: Record<string, string> = {
  CODING: "#a78bfa",
  SYSTEM_DESIGN: "#f5a97f",
  BEHAVIORAL: "#7aa2f7",
  MIXED: "#5bc0c0",
};
const TYPE_LABEL: Record<string, string> = {
  CODING: "Coding",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
  MIXED: "Mixed",
};
const ROUND_MINUTES: Record<string, number> = {
  CODING: 45,
  SYSTEM_DESIGN: 60,
  BEHAVIORAL: 45,
  MIXED: 45,
};

type Msg = {
  id: string;
  kind: "question" | "followup" | "answer" | "feedback" | "transition";
  text: string;
  isCode?: boolean;
  tests?: string | null;
  score?: number;
  tags?: { label: string; good: boolean }[];
};

type RoundMeta = { id: string; name: string; type: string; order: number; status: string };

type ApiAnswer = { content: string; language: string | null; score: number | null; strengths: unknown; weaknesses: unknown; feedback: string | null };
type ApiQuestion = { id: string; text: string; category: string | null; parentQuestionId: string | null; order: number; answer: ApiAnswer | null };
type ApiRound = { id: string; name: string; type: string; order: number; status: string; questions: ApiQuestion[] };
type ApiSession = { id: string; company: string | null; role: string; status: string; currentRound: number; rounds: ApiRound[] };

let mid = 0;
const newId = () => `m${++mid}`;

function asStrArr(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function feedbackTags(a: ApiAnswer) {
  return [
    ...asStrArr(a.strengths).map((label) => ({ label, good: true })),
    ...asStrArr(a.weaknesses).map((label) => ({ label, good: false })),
  ];
}

export function SessionView({ sessionId }: { sessionId: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rounds, setRounds] = useState<RoundMeta[]>([]);
  const [activeRound, setActiveRound] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [activeQuestion, setActiveQuestion] = useState<{ id: string; type: string } | null>(null);

  const [input, setInput] = useState("");
  const [code, setCode] = useState("function solution() {\n  \n}");
  const [useCode, setUseCode] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  const hydrate = useCallback((session: ApiSession) => {
    const meta: RoundMeta[] = session.rounds.map((r) => ({ id: r.id, name: r.name, type: r.type, order: r.order, status: r.status }));
    const msgs: Msg[] = [];
    let active: { id: string; type: string } | null = null;
    let activeIdx = session.currentRound ?? 0;

    for (const r of session.rounds) {
      for (const q of r.questions) {
        msgs.push({
          id: newId(),
          kind: q.parentQuestionId ? "followup" : "question",
          text: q.text,
          tests: q.category,
        });
        if (q.answer) {
          msgs.push({ id: newId(), kind: "answer", text: q.answer.content, isCode: !!q.answer.language });
          msgs.push({
            id: newId(),
            kind: "feedback",
            text: q.answer.feedback ?? "",
            score: q.answer.score ?? undefined,
            tags: feedbackTags(q.answer),
          });
        } else if (!active) {
          active = { id: q.id, type: r.type };
          activeIdx = r.order;
        }
      }
    }

    setRounds(meta);
    setMessages(msgs);
    setActiveQuestion(active);
    setActiveRound(activeIdx);
    setUseCode(active?.type === "CODING");
    setComplete(session.status === "COMPLETED" || !active);
  }, []);

  // initial load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) throw new Error("Could not load this interview");
        const data = await res.json();
        if (!cancelled) hydrate(data.session as ApiSession);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, hydrate]);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, complete]);

  // timer
  useEffect(() => {
    if (complete || loading) return;
    const type = rounds[activeRound]?.type ?? "MIXED";
    setSecondsLeft((ROUND_MINUTES[type] ?? 45) * 60);
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [activeRound, complete, loading, rounds]);

  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const send = async () => {
    if (!activeQuestion || thinking || complete) return;
    const isCoding = activeQuestion.type === "CODING" && useCode;
    const answer = isCoding ? code : input.trim();
    if (!answer) return;

    setMessages((m) => [...m, { id: newId(), kind: "answer", text: answer, isCode: isCoding }]);
    setInput("");
    setThinking(true);
    setError(null);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/turn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: activeQuestion.id, answer, language: isCoding ? "javascript" : undefined }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error || "Failed to submit answer");
      const data = await res.json();

      const add: Msg[] = [];
      if (data.feedback) {
        add.push({
          id: newId(),
          kind: "feedback",
          text: data.feedback.feedback ?? "",
          score: data.feedback.score,
          tags: [
            ...asStrArr(data.feedback.strengths).map((label: string) => ({ label, good: true })),
            ...asStrArr(data.feedback.weaknesses).map((label: string) => ({ label, good: false })),
          ],
        });
      }
      if (data.transition) {
        add.push({ id: newId(), kind: "transition", text: `Round ${data.transition.index + 1} of ${data.transition.total} · ${data.transition.name}` });
        setActiveRound(data.transition.index);
      }
      if (data.next) {
        add.push({ id: newId(), kind: data.next.kind === "followup" ? "followup" : "question", text: data.next.text, tests: data.next.category ?? null });
        const nextType = data.transition ? data.transition.type : activeQuestion.type;
        setActiveQuestion({ id: data.next.id, type: nextType });
        setUseCode(nextType === "CODING");
      } else if (data.complete) {
        setActiveQuestion(null);
        setComplete(true);
      }
      setMessages((m) => [...m, ...add]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setThinking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <span className="h-8 w-8 rounded-full border-[3px] border-line border-t-[#a78bfa] demo-spin" />
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="mx-auto flex h-[60vh] max-w-md flex-col items-center justify-center px-5 text-center">
        <p className="text-sm text-ink-soft">{error}</p>
        <Link href="/dashboard" className="mt-4 rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink hover:bg-surface">Back to dashboard</Link>
      </div>
    );
  }

  const round = rounds[activeRound];
  const isCodingRound = round?.type === "CODING";

  return (
    <div className="mx-auto flex h-[calc(100dvh-61px)] max-w-3xl flex-col px-4 sm:px-6">
      {/* Round progress */}
      <div className="shrink-0 border-b border-line py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLORS[round?.type] ?? "#9a9aa3" }} />
            <span className="text-sm font-semibold text-ink">Round {activeRound + 1} of {rounds.length}</span>
            <span className="text-sm text-muted">· {round?.name}</span>
          </div>
          {!complete && (
            <span className="flex items-center gap-1.5 rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink-soft">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
              {mmss}
            </span>
          )}
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {rounds.map((r, i) => (
            <div key={r.id} className="h-1 flex-1 overflow-hidden rounded-full bg-subtle">
              <div className="h-full rounded-full transition-all duration-500" style={{ width: complete || i < activeRound ? "100%" : i === activeRound ? "55%" : "0%", background: TYPE_COLORS[r.type] ?? "#9a9aa3" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-5">
        <div className="flex flex-col gap-4">
          {messages.map((m) => <Message key={m.id} m={m} />)}
          {thinking && <Thinking />}
          {error && messages.length > 0 && <p className="text-center text-xs text-red-500">{error}</p>}
          {complete && <Completion sessionId={sessionId} />}
        </div>
      </div>

      {/* Input */}
      {!complete && activeQuestion && (
        <div className="shrink-0 border-t border-line py-3">
          {isCodingRound && (
            <div className="mb-2 flex items-center gap-2">
              <button onClick={() => setUseCode(true)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${useCode ? "bg-ink text-card" : "bg-subtle text-ink-soft"}`}>Code</button>
              <button onClick={() => setUseCode(false)} className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${!useCode ? "bg-ink text-card" : "bg-subtle text-ink-soft"}`}>Notes</button>
            </div>
          )}
          {isCodingRound && useCode ? (
            <CodeEditor value={code} onChange={setCode} />
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}
              rows={3}
              placeholder="Type your answer… (Ctrl/⌘ + Enter to send)"
              className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
            />
          )}
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted">{isCodingRound && useCode ? "Submit your solution" : "Answer in your own words"}</span>
            <button onClick={send} disabled={thinking} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 disabled:opacity-40 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]">
              {thinking ? "Sending…" : "Send"}
              {!thinking && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Message({ m }: { m: Msg }) {
  if (m.kind === "transition") {
    return (
      <div className="flex items-center gap-3 py-2">
        <span className="h-px flex-1 bg-line" />
        <span className="rounded-full border border-line bg-card px-3 py-1 text-[11px] font-semibold text-ink-soft">{m.text}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }
  if (m.kind === "answer") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          {m.isCode ? (
            <pre className="overflow-x-auto rounded-2xl rounded-br-sm bg-[#1a1a1e] px-3.5 py-2.5 font-mono text-[12px] leading-relaxed text-white/90">{m.text}</pre>
          ) : (
            <div className="rounded-2xl rounded-br-sm bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3.5 py-2.5 text-sm leading-relaxed text-white/90 dark:from-[#2a2a30] dark:to-[#161619]">{m.text}</div>
          )}
        </div>
      </div>
    );
  }
  if (m.kind === "feedback") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-ink">Live feedback</span>
          {m.score != null && <span className="rounded-full bg-[#8bd5a0]/15 px-2 py-0.5 text-[11px] font-bold text-[#16a34a]">{m.score} / 10</span>}
        </div>
        {m.text && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{m.text}</p>}
        {m.tags && m.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.tags.map((t) => (
              <span key={t.label} className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${t.good ? "bg-[#8bd5a0]/15 text-[#16a34a]" : "bg-[#f5a97f]/15 text-[#d97706]"}`}>{t.good ? "+ " : "Δ "}{t.label}</span>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[11px] font-bold text-white sheen">AI</span>
      <div className="max-w-[85%]">
        {m.kind === "followup" && <span className="mb-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-muted">Follow-up</span>}
        <div className="rounded-2xl rounded-tl-sm bg-subtle px-3.5 py-2.5 text-sm leading-relaxed text-ink">{m.text}</div>
        {m.tests && <span className="mt-1 inline-block text-[10px] font-medium text-muted">Tests: {m.tests}</span>}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[11px] font-bold text-white sheen">AI</span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-subtle px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
      </div>
    </div>
  );
}

function Completion({ sessionId }: { sessionId: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6 text-center shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8bd5a0]/15 text-2xl text-[#16a34a]">✓</span>
      <h2 className="mt-3 font-serif text-2xl font-medium text-ink">Interview complete</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Nice work — you finished all rounds. Generate your detailed scorecard next.</p>
      <div className="mt-5 flex justify-center gap-3">
        <Link href={`/interview/${sessionId}/results`} className="rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen dark:from-white dark:to-[#dcdce0] dark:text-[#161619]">View scorecard</Link>
        <Link href="/dashboard" className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface">Back to dashboard</Link>
      </div>
    </div>
  );
}
