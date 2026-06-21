"use client";

import { DemoTriggerButton } from "./demo/DemoTriggerButton";
import { useReveal } from "./useReveal";

export function Solution() {
  const [revealRef, revealed] = useReveal();

  return (
    <section id="features" ref={revealRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Outer Bento Grid container */}
      <div className="relative overflow-hidden rounded-[40px] border border-line bg-gradient-to-b from-white to-[#f7f6f9] dark:from-[#141417] dark:to-[#0e0e11] px-6 py-12 sm:rounded-[48px] sm:px-12 sm:py-16 shadow-[0_30px_70px_-20px_rgba(20,20,40,0.12)] dark:shadow-[0_30px_70px_-20px_rgba(0,0,0,0.5)]">
        
        {/* Solutions Tag & Header */}
        <div className={`text-center mb-10 sm:mb-14 reveal-fade-up ${revealed ? "revealed" : ""}`}>
          <div className="inline-block mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
              Solution
            </span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Interview Prep, Reinvented
          </h2>
        </div>

        {/* 3x2 Asymmetric Bento Grid wrapper */}
        <div className="relative">
          
          {/* Floating Intersection Center Badge with ripple rings (only in the 4-col cross layout) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <div className="relative flex h-16 w-16 items-center justify-center">
              {/* static concentric rings */}
              <span aria-hidden className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/70" />
              <span aria-hidden className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/45" />
              <span aria-hidden className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/25" />

              {/* animated ripple pulses */}
              {revealed && (
                <>
                  <span aria-hidden className="ripple-ring absolute left-1/2 top-1/2 h-20 w-20 rounded-full border border-line/40" />
                  <span aria-hidden className="ripple-ring ripple-ring-2 absolute left-1/2 top-1/2 h-20 w-20 rounded-full border border-line/30" />
                  <span aria-hidden className="ripple-ring ripple-ring-3 absolute left-1/2 top-1/2 h-20 w-20 rounded-full border border-line/20" />
                </>
              )}

              {/* badge */}
              {revealed && (
                <div className="solution-center-badge relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-white dark:border-card bg-gradient-to-b from-[#3b3b41] to-[#161619] shadow-[0_12px_32px_rgba(0,0,0,0.45)] sheen">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M9 8l-4 4 4 4" />
                    <path d="M15 8l4 4-4 4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Bento Grid: 1 col (mobile) → 2 cols (tablet) → 4 cols cross layout (desktop) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
            
            {/* CARD 1: Top-Left (col-span-2) - Client-facing portal / AI Mock Interview Workspace */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up sm:col-span-2 ${revealed ? "revealed" : ""} delay-100`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Practice Workspace</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">AI Mock Interview Workspace</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed max-w-md">
                    A dedicated interactive dashboard with full loop visibility, live coding runtimes, and real-time response evaluation.
                  </p>
                </div>
                
                {/* Card 1 Mockup */}
                <div className="mt-4 rounded-xl border border-line bg-card p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="flex gap-4">
                    {/* Left Sidebar Mock */}
                    <div className="w-1/3 border-r border-line/60 pr-3 flex flex-col gap-1 select-none">
                      <div className="flex items-center gap-1.5 text-[8px] font-bold text-ink mb-1">
                        <span className="flex h-3 w-3 items-center justify-center rounded bg-gradient-to-b from-[#3b3b41] to-[#161619] text-[6px] text-white font-bold">&lt;&gt;</span>
                        devmock
                      </div>
                      {["Dashboard", "Interviews", "Practice", "Resume", "Reports"].map((label, idx) => (
                        <span key={label} className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[7px] font-semibold ${idx === 0 ? "bg-page text-ink" : "text-muted"}`}>
                          <span className="h-1 w-1 rounded-full bg-ink opacity-60" />
                          {label}
                        </span>
                      ))}
                    </div>
                    {/* Right Chat/Stats View Mock */}
                    <div className="flex-1 flex flex-col justify-between">
                      <p className="text-[9px] font-bold text-ink select-none">Hello Aditya Kumar!</p>
                      <div className="mt-2.5 flex gap-2">
                        {/* Widget 1 */}
                        <div className="flex-1 rounded-lg border border-line bg-surface p-2">
                          <p className="text-[6px] font-bold uppercase tracking-wider text-muted">AI Status</p>
                          <p className="text-[10px] font-bold text-ink mt-0.5">Round 2</p>
                          <p className="text-[5px] text-ink font-semibold">Coding active</p>
                        </div>
                        {/* Widget 2 */}
                        <div className="flex-1 rounded-lg border border-line bg-surface p-2">
                          <p className="text-[6px] font-bold uppercase tracking-wider text-muted">Completed</p>
                          <p className="text-[10px] font-bold text-ink mt-0.5">2 / 5 rounds</p>
                          <p className="text-[5px] text-muted">Score: 8.2</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Top-Middle (col-span-1) - Retainer Utilization Tracking / Company-Specific Loops */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up md:col-span-1 ${revealed ? "revealed" : ""} delay-200`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Company-Specific</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">Company Loops</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                    Recreates actual loops from Amazon, Google, or Meta.
                  </p>
                </div>
                
                {/* Card 2 Mockup */}
                <div className="mt-4 rounded-xl border border-line bg-card p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center min-h-[110px] relative">
                  {/* Back card */}
                  <div className="absolute inset-x-4 top-1 h-14 rounded-lg border border-line/40 bg-page/40 -translate-y-2 z-0" />
                  {/* Front card */}
                  <div className="rounded-lg border border-line bg-surface p-3 shadow-sm w-full z-10 text-center select-none animate-pulse" style={{ animationDuration: "3s" }}>
                    <p className="text-[7px] font-bold uppercase tracking-wider text-muted">Amazon SDE II</p>
                    <p className="font-serif text-xl font-bold tracking-tight text-ink mt-1">5 Rounds</p>
                    <p className="text-[6px] text-muted">Behavioral, Coding, Design</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 3: Top-Right (col-span-1) - Task Management / Monaco Code Sandbox */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up md:col-span-1 ${revealed ? "revealed" : ""} delay-300`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Live Coding</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">Monaco Sandbox</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                    Write, execute, and compile code in real-time in the sandbox.
                  </p>
                </div>
                
                {/* Card 3 Mockup */}
                <div className="mt-4 overflow-hidden rounded-xl border border-line bg-[#1a1a1e] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.2)] flex-1 flex flex-col min-h-[110px]">
                  <div className="flex items-center gap-1 border-b border-white/5 bg-card/5 px-2 py-1 select-none">
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="h-1 w-1 rounded-full bg-ink" />
                    <span className="ml-1.5 font-mono text-[6px] text-white/40">solution.py</span>
                    <span className="ml-auto rounded-md bg-ink/15 px-1 py-0.2 text-[5px] font-semibold text-ink">Compiled ✓</span>
                  </div>
                  <pre className="p-2 font-mono text-[7px] leading-relaxed text-white/80 select-none overflow-x-auto">
                    <span className="text-ink font-semibold">def</span> <span className="text-ink-soft">two_sum</span>(nums, target):
                    {"\n"}  seen = {"{}"}
                    {"\n"}  <span className="text-ink font-semibold">for</span> i, n <span className="text-ink font-semibold">in</span> ...<span className="typewriter-cursor" />
                  </pre>
                </div>
              </div>
            </div>

            {/* CARD 4: Bottom-Left (col-span-1) - Voice Mode (mockup on top, text at bottom) */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up md:col-span-1 ${revealed ? "revealed" : ""} delay-150`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                {/* Card 4 Mockup (top) */}
                <div className="rounded-xl border border-line bg-card p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.06)] flex flex-col justify-between min-h-[110px]">
                  {/* bubble */}
                  <div className="rounded-lg bg-subtle p-2 text-[8px] leading-normal text-ink-soft select-none transition-all duration-300 hover:bg-card hover:scale-[1.02]">
                    &ldquo;I resolved the issue by migrating the DB cache...&rdquo;
                  </div>
                  {/* wave pulse */}
                  <div className="flex items-end justify-center gap-1 h-8 select-none">
                    <span className="h-3 w-0.5 rounded-full bg-ink-soft wave-pulse-1" />
                    <span className="h-5 w-0.5 rounded-full bg-ink-soft wave-pulse-2" />
                    <span className="h-7 w-0.5 rounded-full bg-ink wave-pulse-3" />
                    <span className="h-4 w-0.5 rounded-full bg-ink-soft wave-pulse-4" />
                    <span className="h-2.5 w-0.5 rounded-full bg-muted wave-pulse-5" />
                  </div>
                </div>

                {/* Text (bottom) */}
                <div className="mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Voice Mode</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">Speak Your Answers</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                    Talk through behavioral questions. AI converts your voice to text.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 5: Bottom-Middle (col-span-1) - Integrations (mockup on top, text at bottom) */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up md:col-span-1 ${revealed ? "revealed" : ""} delay-250`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                {/* Card 5 Mockup (top) */}
                <div className="rounded-xl border border-line bg-card p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.06)] flex-1 flex items-center justify-center min-h-[110px] relative select-none">
                  {/* SVG Connections */}
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-line" preserveAspectRatio="none">
                    <line x1="50" y1="50" x2="25" y2="25" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="50" x2="75" y2="25" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="50" x2="25" y2="75" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="50" x2="75" y2="75" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  </svg>
                  {/* Center Badge */}
                  <div className="absolute h-8 w-8 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] flex items-center justify-center shadow z-10 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-[7px] text-white font-bold">&lt;&gt;</span>
                  </div>
                  {/* Satellite Badges */}
                  <div className="absolute top-[12%] left-[12%] h-5 w-5 rounded-full bg-card border border-line shadow-sm flex items-center justify-center font-bold text-[6px] text-ink">G</div>
                  <div className="absolute top-[12%] right-[12%] h-5 w-5 rounded-full bg-card border border-line shadow-sm flex items-center justify-center font-bold text-[6px] text-ink">L</div>
                  <div className="absolute bottom-[12%] left-[12%] h-5 w-5 rounded-full bg-card border border-line shadow-sm flex items-center justify-center font-bold text-[6px] text-ink">R</div>
                  <div className="absolute bottom-[12%] right-[12%] h-5 w-5 rounded-full bg-card border border-line shadow-sm flex items-center justify-center font-bold text-[6px] text-ink">M</div>
                </div>

                {/* Text (bottom) */}
                <div className="mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Integrations</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">Bring Your Profile</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                    Pulls projects from your GitHub, LinkedIn, or uploaded resume.
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 6: Bottom-Right (col-span-2) - Scorecards (mockup on top, text at bottom) */}
            <div className={`group rounded-[28px] border border-line bg-card/30 p-2 sm:p-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_28px_-20px_rgba(20,20,40,0.12)] hover:translate-y-[-2px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_18px_36px_-24px_rgba(20,20,40,0.18)] transition-all duration-300 flex flex-col justify-stretch min-h-[260px] reveal-fade-up sm:col-span-2 ${revealed ? "revealed" : ""} delay-350`}>
              <div className="flex-1 rounded-[20px] border border-line bg-gradient-to-br from-card to-surface p-5 shadow-[0_2px_6px_rgba(20,20,40,0.02)] flex flex-col justify-between">
                {/* Card 6 Mockup (top) */}
                <div className="rounded-xl border border-line bg-card p-3 shadow-[0_10px_25px_-10px_rgba(0,0,0,0.06)] overflow-hidden">
                  <div className="text-[7px] font-bold uppercase tracking-wider text-muted border-b border-line pb-1.5 flex justify-between select-none">
                    <span>ROUND NAME</span>
                    <div className="flex gap-10 pr-6">
                      <span>RATING</span>
                      <span>FOCUS AREAS</span>
                    </div>
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1 select-none">
                    {/* Round item 1 */}
                    <div className="flex items-center justify-between text-[8px] font-semibold text-ink py-1 border-b border-line/40 transition-transform duration-300 hover:translate-x-1">
                      <span className="truncate max-w-[120px]">Coding Round: DSA Arrays</span>
                      <div className="flex gap-8 items-center">
                        <span className="font-bold text-ink w-10 text-center bg-subtle rounded py-0.5">8.5/10</span>
                        <span className="rounded bg-subtle text-ink-soft px-1 py-0.5 text-[6px] w-16 text-center truncate font-bold">Arrays, HashMaps</span>
                      </div>
                    </div>
                    {/* Round item 2 */}
                    <div className="flex items-center justify-between text-[8px] font-semibold text-ink py-1 border-b border-line/40 transition-transform duration-300 hover:translate-x-1">
                      <span className="truncate max-w-[120px]">System Design: Scalability</span>
                      <div className="flex gap-8 items-center">
                        <span className="font-bold text-ink w-10 text-center bg-subtle rounded py-0.5">7.2/10</span>
                        <span className="rounded bg-subtle text-ink-soft px-1 py-0.5 text-[6px] w-16 text-center truncate font-bold">Caching, Sharding</span>
                      </div>
                    </div>
                    {/* Round item 3 */}
                    <div className="flex items-center justify-between text-[8px] font-semibold text-ink py-1 transition-transform duration-300 hover:translate-x-1">
                      <span className="truncate max-w-[120px]">Behavioral: Earn Trust</span>
                      <div className="flex gap-8 items-center">
                        <span className="font-bold text-ink w-10 text-center bg-subtle rounded py-0.5">8.0/10</span>
                        <span className="rounded bg-subtle text-ink-soft px-1 py-0.5 text-[6px] w-16 text-center truncate font-bold">Ownership, Trust</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text (bottom) */}
                <div className="mt-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-ink-soft">Performance Reports</span>
                  <h3 className="text-base font-bold text-ink mt-0.5">Automated Scorecards</h3>
                  <p className="text-[11px] text-ink-soft mt-1 leading-relaxed max-w-md">
                    Generates an end-to-end breakdown of your coding, system design, and
                    communication skills — no manual grading required.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Demo Button Container */}
        <div className={`mt-10 flex justify-center reveal-fade-up ${revealed ? "revealed" : ""} delay-500`}>
          <DemoTriggerButton variant="compact" />
        </div>

      </div>
    </section>
  );
}
