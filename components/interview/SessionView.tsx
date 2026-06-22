"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CodeEditor } from "./CodeEditor";

type Q = { text: string; tests: string; followUp?: string };
type Round = { name: string; type: string; minutes: number; questions: Q[] };

const TYPE_COLORS: Record<string, string> = {
  Coding: "#a78bfa",
  "System Design": "#f5a97f",
  Behavioral: "#7aa2f7",
};

// Mock session (stands in for the generated plan until the backend is wired up).
const ROUNDS: Round[] = [
  {
    name: "Online Assessment",
    type: "Coding",
    minutes: 45,
    questions: [
      {
        text: "Given an array of integers, return the indices of the two numbers that add up to a target.",
        tests: "Arrays · Hash Maps",
        followUp: "Nice — what's the time and space complexity of your approach?",
      },
    ],
  },
  {
    name: "System Design",
    type: "System Design",
    minutes: 60,
    questions: [
      {
        text: "Design a URL shortener that handles 100M requests per day. Start with the API and data model.",
        tests: "Scalability · Caching",
        followUp: "Good. How would you handle cache invalidation under heavy writes?",
      },
    ],
  },
  {
    name: "Behavioral (Bar Raiser)",
    type: "Behavioral",
    minutes: 45,
    questions: [
      {
        text: "Tell me about a time you took ownership of a problem outside your direct responsibility.",
        tests: "Ownership · Dive Deep",
      },
    ],
  },
];

type Msg = {
  id: number;
  kind: "question" | "followup" | "answer" | "feedback" | "transition";
  text: string;
  isCode?: boolean;
  tests?: string;
  score?: number;
  tags?: { label: string; good: boolean }[];
};

const FEEDBACK: Record<string, { text: string; tags: { label: string; good: boolean }[] }> = {
  Coding: {
    text: "Clean approach with a clear data structure choice. Watch for duplicate values and empty input.",
    tags: [
      { label: "Clear approach", good: true },
      { label: "Add edge cases", good: false },
    ],
  },
  "System Design": {
    text: "Solid API and data model. Strengthen the scaling story — talk through partitioning and rate limiting.",
    tags: [
      { label: "Good data model", good: true },
      { label: "Add rate limiting", good: false },
    ],
  },
  Behavioral: {
    text: "Nice STAR structure. Quantify the impact and clarify what you specifically owned.",
    tags: [
      { label: "Clear structure", good: true },
      { label: "Quantify impact", good: false },
    ],
  },
};

let counter = 0;
const nextId = () => ++counter;

export function SessionView({ sessionId }: { sessionId: string }) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [inFollowUp, setInFollowUp] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [code, setCode] = useState("function twoSum(nums, target) {\n  \n}");
  const [useCode, setUseCode] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [complete, setComplete] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(ROUNDS[0].minutes * 60);

  const scrollRef = useRef<HTMLDivElement>(null);
  const round = ROUNDS[roundIdx];

  // seed first question
  useEffect(() => {
    const q = ROUNDS[0].questions[0];
    setMessages([{ id: nextId(), kind: "question", text: q.text, tests: q.tests }]);
  }, []);

  // autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, complete]);

  // round timer
  useEffect(() => {
    if (complete) return;
    setSecondsLeft(ROUNDS[roundIdx].minutes * 60);
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [roundIdx, complete]);

  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const send = () => {
    const isCoding = round.type === "Coding" && useCode;
    const answer = isCoding ? code : input.trim();
    if (!answer || thinking || complete) return;

    setMessages((m) => [...m, { id: nextId(), kind: "answer", text: answer, isCode: isCoding }]);
    setInput("");
    setThinking(true);

    setTimeout(() => {
      const fb = FEEDBACK[round.type];
      const score = 7 + ((roundIdx + qIdx) % 3); // 7–9
      setMessages((m) => [
        ...m,
        { id: nextId(), kind: "feedback", text: fb.text, score, tags: fb.tags },
      ]);

      const q = round.questions[qIdx];
      // follow-up?
      if (q.followUp && !inFollowUp) {
        setInFollowUp(true);
        setMessages((m) => [...m, { id: nextId(), kind: "followup", text: q.followUp! }]);
        setThinking(false);
        return;
      }
      setInFollowUp(false);

      // next question in round
      if (qIdx + 1 < round.questions.length) {
        const nq = round.questions[qIdx + 1];
        setQIdx((i) => i + 1);
        setMessages((m) => [...m, { id: nextId(), kind: "question", text: nq.text, tests: nq.tests }]);
        setThinking(false);
        return;
      }

      // next round
      if (roundIdx + 1 < ROUNDS.length) {
        const nextRound = ROUNDS[roundIdx + 1];
        const nq = nextRound.questions[0];
        setMessages((m) => [
          ...m,
          { id: nextId(), kind: "transition", text: `Round ${roundIdx + 2} of ${ROUNDS.length} · ${nextRound.name}` },
          { id: nextId(), kind: "question", text: nq.text, tests: nq.tests },
        ]);
        setRoundIdx((i) => i + 1);
        setQIdx(0);
        setUseCode(nextRound.type === "Coding");
        setThinking(false);
        return;
      }

      // complete
      setComplete(true);
      setThinking(false);
    }, 1100);
  };

  return (
    <div className="mx-auto flex h-[calc(100dvh-61px)] max-w-3xl flex-col px-4 sm:px-6">
      {/* Round progress */}
      <div className="shrink-0 border-b border-line py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: TYPE_COLORS[round.type] }} />
            <span className="text-sm font-semibold text-ink">
              Round {roundIdx + 1} of {ROUNDS.length}
            </span>
            <span className="text-sm text-muted">· {round.name}</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-md border border-line bg-card px-2 py-1 font-mono text-xs text-ink-soft">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5"><circle cx="12" cy="12" r="9" /><path d="M12 8v4l3 2" /></svg>
            {mmss}
          </span>
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {ROUNDS.map((r, i) => (
            <div key={r.name} className="h-1 flex-1 overflow-hidden rounded-full bg-subtle">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: i < roundIdx || complete ? "100%" : i === roundIdx ? "50%" : "0%",
                  background: TYPE_COLORS[r.type],
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-5">
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <Message key={m.id} m={m} />
          ))}
          {thinking && <Thinking />}
          {complete && <Completion sessionId={sessionId} />}
        </div>
      </div>

      {/* Input */}
      {!complete && (
        <div className="shrink-0 border-t border-line py-3">
          {round.type === "Coding" && (
            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => setUseCode(true)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${useCode ? "bg-ink text-card" : "bg-subtle text-ink-soft"}`}
              >
                Code
              </button>
              <button
                onClick={() => setUseCode(false)}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${!useCode ? "bg-ink text-card" : "bg-subtle text-ink-soft"}`}
              >
                Notes
              </button>
            </div>
          )}

          {round.type === "Coding" && useCode ? (
            <CodeEditor value={code} onChange={setCode} />
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
              }}
              rows={3}
              placeholder="Type your answer… (Ctrl/⌘ + Enter to send)"
              className="w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
            />
          )}

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-muted">
              {round.type === "Coding" && useCode ? "Submit your solution" : "Answer in your own words"}
            </span>
            <button
              onClick={send}
              disabled={thinking}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 disabled:opacity-40 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
            >
              Send
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
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
        <span className="rounded-full border border-line bg-card px-3 py-1 text-[11px] font-semibold text-ink-soft">
          {m.text}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }

  if (m.kind === "answer") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          {m.isCode ? (
            <pre className="overflow-x-auto rounded-2xl rounded-br-sm bg-[#1a1a1e] px-3.5 py-2.5 font-mono text-[12px] leading-relaxed text-white/90">
              {m.text}
            </pre>
          ) : (
            <div className="rounded-2xl rounded-br-sm bg-gradient-to-b from-[#3b3b41] to-[#161619] px-3.5 py-2.5 text-sm leading-relaxed text-white/90 dark:from-[#2a2a30] dark:to-[#161619]">
              {m.text}
            </div>
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
          <span className="rounded-full bg-[#8bd5a0]/15 px-2 py-0.5 text-[11px] font-bold text-[#16a34a]">
            {m.score} / 10
          </span>
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{m.text}</p>
        {m.tags && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {m.tags.map((t) => (
              <span
                key={t.label}
                className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
                  t.good ? "bg-[#8bd5a0]/15 text-[#16a34a]" : "bg-[#f5a97f]/15 text-[#d97706]"
                }`}
              >
                {t.good ? "+ " : "Δ "}
                {t.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // question / followup
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[11px] font-bold text-white sheen">
        AI
      </span>
      <div className="max-w-[85%]">
        {m.kind === "followup" && (
          <span className="mb-1 inline-block text-[10px] font-semibold uppercase tracking-wide text-muted">
            Follow-up
          </span>
        )}
        <div className="rounded-2xl rounded-tl-sm bg-subtle px-3.5 py-2.5 text-sm leading-relaxed text-ink">
          {m.text}
        </div>
        {m.tests && (
          <span className="mt-1 inline-block text-[10px] font-medium text-muted">
            Tests: {m.tests}
          </span>
        )}
      </div>
    </div>
  );
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[11px] font-bold text-white sheen">
        AI
      </span>
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
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8bd5a0]/15 text-2xl text-[#16a34a]">
        ✓
      </span>
      <h2 className="mt-3 font-serif text-2xl font-medium text-ink">Interview complete</h2>
      <p className="mt-1.5 text-sm text-ink-soft">
        Nice work — you finished all rounds. Your detailed scorecard is on the way.
      </p>
      <div className="mt-5 flex justify-center gap-3">
        <Link
          href={`/interview/${sessionId}/results`}
          className="rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-2.5 text-sm font-medium text-white sheen dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
        >
          View scorecard
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
