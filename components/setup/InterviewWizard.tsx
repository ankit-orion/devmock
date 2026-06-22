"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  generatePlan,
  difficultyNote,
  KNOWN_COMPANIES,
  TYPE_COLORS,
  type Round,
  type Difficulty,
  type InterviewType,
} from "@/lib/interview-templates";

const STEPS = ["Role", "Resume", "Format"];
const DIFFICULTIES: Difficulty[] = ["Junior", "Mid", "Senior"];
const TYPES: InterviewType[] = ["Mixed", "Coding", "System Design", "Behavioral"];

function typeColor(type: string) {
  return TYPE_COLORS[type] ?? "#9a9aa3";
}

export function InterviewWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [view, setView] = useState<"form" | "generating" | "plan">("form");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jd, setJd] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Mid");
  const [type, setType] = useState<InterviewType>("Mixed");
  const [plan, setPlan] = useState<Round[]>([]);

  const step1Valid = role.trim().length > 0 && (company.trim() || jd.trim());

  const handleFile = (file?: File | null) => {
    if (file) setResumeName(file.name);
  };

  const generate = () => {
    setView("generating");
    setTimeout(() => {
      setPlan(generatePlan({ company, type, difficulty }));
      setView("plan");
    }, 1300);
  };

  const removeRound = (i: number) =>
    setPlan((p) => p.filter((_, idx) => idx !== i));

  const start = () => {
    const id = `sess_${Math.random().toString(36).slice(2, 8)}`;
    router.push(`/interview/${id}`);
  };

  const totalQuestions = plan.reduce((sum, r) => sum + r.count, 0);

  /* ---------------- Plan preview ---------------- */
  if (view === "plan") {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8bd5a0]" />
            Plan ready
          </span>
          <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink">
            Your interview plan
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {company ? `${company} · ` : ""}
            {role || "Custom role"} — {plan.length} rounds, {totalQuestions} questions
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {plan.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              className="group flex items-start gap-3 rounded-2xl border border-line bg-card p-4 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)]"
            >
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ background: typeColor(r.type) }}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink">{r.name}</h3>
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                    style={{ background: `${typeColor(r.type)}22`, color: typeColor(r.type) }}
                  >
                    {r.type}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {r.focus.map((f) => (
                    <span key={f} className="rounded-md bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
                      {f}
                    </span>
                  ))}
                  <span className="rounded-md bg-subtle px-1.5 py-0.5 text-[10px] font-medium text-muted">
                    {r.count} {r.count === 1 ? "question" : "questions"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeRound(i)}
                aria-label={`Remove ${r.name}`}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-subtle hover:text-ink"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => setView("form")}
            className="rounded-full border border-line bg-card px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface"
          >
            Back to edit
          </button>
          <button
            type="button"
            onClick={start}
            disabled={plan.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-3 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 disabled:opacity-40 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
          >
            Start interview
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- Generating ---------------- */
  if (view === "generating") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
        <span className="h-10 w-10 rounded-full border-[3px] border-line border-t-[#a78bfa] demo-spin" />
        <p className="mt-5 text-sm font-medium text-ink">
          Designing your {company || "custom"} interview…
        </p>
        <p className="mt-1 text-xs text-muted">Planning rounds, focus areas and questions</p>
      </div>
    );
  }

  /* ---------------- Form ---------------- */
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-6">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  i <= step ? "bg-ink text-card" : "bg-subtle text-muted"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={`text-xs font-medium ${i <= step ? "text-ink" : "text-muted"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line" />}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-card p-5 shadow-[0_2px_8px_-4px_rgba(20,20,40,0.06)] sm:p-6">
        {/* Step 1: Role & Company */}
        {step === 0 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Who are you interviewing with?</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Pick a company for a tailored loop, or describe the role below.
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft">Company (optional)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Amazon"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {KNOWN_COMPANIES.slice(0, 6).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCompany(c)}
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      company === c
                        ? "border-ink bg-ink text-card"
                        : "border-line bg-surface text-ink-soft hover:text-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft">Role</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft">
                Job description {company ? "(optional)" : "(recommended)"}
              </label>
              <textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={4}
                placeholder="Paste the job description to tailor the questions…"
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink/30"
              />
            </div>
          </div>
        )}

        {/* Step 2: Resume */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-lg font-semibold text-ink">Add your resume</h2>
              <p className="mt-1 text-sm text-ink-soft">
                Optional — lets the AI ask about your actual projects and experience.
              </p>
            </div>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line bg-surface px-6 py-10 text-center transition-colors hover:border-ink/30"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7aa2f7] text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
                </svg>
              </span>
              {resumeName ? (
                <>
                  <span className="text-sm font-medium text-ink">{resumeName}</span>
                  <span className="text-[11px] text-[#16a34a]">Uploaded — click to replace</span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-ink">
                    Drop your resume here, or click to browse
                  </span>
                  <span className="text-[11px] text-muted">PDF, DOC or DOCX</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>

            {resumeName && (
              <button
                type="button"
                onClick={() => setResumeName("")}
                className="self-start text-xs font-medium text-muted hover:text-ink"
              >
                Remove file
              </button>
            )}
          </div>
        )}

        {/* Step 3: Format */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold text-ink">Set the format</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {company
                  ? `We'll base the rounds on ${company}'s real loop and calibrate difficulty.`
                  : "Choose what to focus on and how hard it should be."}
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft">Difficulty</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      difficulty === d
                        ? "border-ink bg-ink text-card"
                        : "border-line bg-surface text-ink-soft hover:text-ink"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted">{difficultyNote(difficulty)}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-ink-soft">Focus</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                      type === t
                        ? "border-ink bg-ink text-card"
                        : "border-line bg-surface text-ink-soft hover:text-ink"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-0"
        >
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 0 && !step1Valid}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-2.5 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 disabled:opacity-40 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
          >
            Continue
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-6 py-2.5 text-sm font-medium text-white sheen transition-all hover:-translate-y-0.5 dark:from-white dark:to-[#dcdce0] dark:text-[#161619]"
          >
            Generate plan
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M13 2L3 14h7l-1 8 10-12h-7z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
