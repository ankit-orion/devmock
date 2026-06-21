"use client";

import { useEffect, useState } from "react";
import { CtaButton } from "@/components/ui/CtaButton";
import { BrandMark, type BrandName } from "@/components/ui/BrandMark";
import { HeroDashboard } from "./HeroDashboard";
import { Mascot } from "@/components/mascot/Mascot";

const brands: BrandName[] = ["Amazon", "Google", "Meta", "Microsoft", "Others"];

const cursorPath = [
  { x: "72%", y: "82%", label: "AI Co-pilot active", activeCard: null },
  { x: "86%", y: "42%", label: "Arrays: Score 8.5/10 (Passed)", activeCard: "card_arrays" },
  { x: "9%", y: "88%", label: "Creating new practice chat...", activeCard: "new_chat" },
  { x: "48%", y: "44%", label: "Analyzing system architecture...", activeCard: "card_caching" },
  { x: "29%", y: "44%", label: "Drafting Amazon Leadership answers", activeCard: "card_behavioral" },
  { x: "67%", y: "65%", label: "Ready for AI Coach feedback", activeCard: "card_databases" }
];

export function Hero() {
  const [active, setActive] = useState(false);
  const [cursorIdx, setCursorIdx] = useState(0);

  useEffect(() => {
    // Slight delay to allow layout to settle before entrance animations begin
    const t = setTimeout(() => setActive(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCursorIdx((prev) => (prev + 1) % cursorPath.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <section className="relative">
      <div className="relative mx-auto max-w-5xl px-5 pt-8 pb-8 text-center sm:px-6 sm:pt-12 sm:pb-10">
        {/* 3D mascot — absolute overlay to the left of the headline (doesn't affect text layout) */}
        <div
          className={`pointer-events-none absolute left-0 top-16 z-10 hidden h-44 w-44 lg:block xl:-left-10 xl:h-56 xl:w-56 transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}
        >
          <Mascot className="h-full w-full" />
        </div>

        <div className={`inline-block mb-4 reveal-fade-up ${active ? "revealed" : ""}`}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
            Introducing devmock
          </span>
        </div>

        <h1 className={`mx-auto mt-2 max-w-3xl font-serif text-[2.25rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl sm:leading-[1.08] md:text-6xl reveal-fade-up ${active ? "revealed" : ""} delay-75`}>
          Practice real interviews, land your dream role
        </h1>

        <p className={`mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:mt-5 sm:text-[15px] sm:leading-7 reveal-fade-up ${active ? "revealed" : ""} delay-150`}>
          devmock simulates company-specific interviews with an AI that plans
          your rounds, asks the questions you&apos;ll actually face, and gives
          detailed feedback, all tailored to the role you&apos;re targeting.
        </p>

        <div className={`mt-6 flex items-center justify-center sm:mt-7 reveal-fade-up ${active ? "revealed" : ""} delay-200`}>
          <CtaButton href="/sign-up" className="px-7 py-3.5">Start Practicing</CtaButton>
        </div>

        {/* brand chips section */}
        <div className="mt-14 sm:mt-16">
          <p className={`text-[11px] font-semibold uppercase tracking-wider text-muted mb-6 reveal-fade-up ${active ? "revealed" : ""} delay-250`}>
            Prepare for interviews at leading teams:
          </p>
          <div className="relative">
            {/* The horizontal connection line at the bottom of the vertical lines */}
            <div className="hidden lg:block absolute bottom-0 left-[16%] right-[16%] h-px bg-line" />

            {/* Central vertical connector down to dashboard */}
            <div className="hidden lg:block absolute left-1/2 bottom-[-40px] h-[40px] w-px bg-line" />

            {/* Chips row (single row from lg so the connector comb lines up) */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:flex-nowrap lg:gap-6">
              {brands.map((brand, i) => (
                <div
                  key={brand}
                  className={`relative flex flex-col items-center reveal-fade-up ${
                    active ? "revealed" : ""
                  }`}
                  style={{ transitionDelay: `${300 + i * 80}ms` }}
                >
                  {/* Outer border wrapper with fixed width for perfect symmetry */}
                  <div className="w-36 rounded-2xl border border-line bg-surface/30 p-[5px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_8px_20px_-14px_rgba(0,0,0,0.1)] hover:translate-y-[-1px] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_12px_24px_-15px_rgba(0,0,0,0.18)] transition-all duration-200">
                    {/* Inner white card */}
                    <div className="w-full flex items-center justify-center rounded-xl border border-line bg-card py-2.5 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]">
                      <BrandMark name={brand} iconClassName="" showName={true} />
                    </div>
                  </div>
                  {/* Vertical connector line */}
                  <div className="hidden lg:block h-6 w-px bg-line" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* product mockup dashboard */}
      <div className="relative mx-auto -mt-2 max-w-4xl px-4 pb-16 sm:px-6 sm:pb-24">
        {/* Notion-style Floating Elements */}
        {/* 1. Speech bubble: AI Feedback */}
        <div className="hidden lg:flex absolute left-[-80px] top-[14%] z-20 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 shadow-lg animate-float-1 hover-float-active cursor-default select-none">
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-subtle text-xs">💬</span>
          <div className="text-left">
            <p className="text-[9px] font-bold text-ink">AI Speech Coach</p>
            <p className="text-[8px] text-ink-soft leading-tight">"Slow down slightly for impact"</p>
          </div>
        </div>

        {/* 2. Resume File upload */}
        <div className="hidden lg:flex absolute right-[-70px] top-[20%] z-20 items-center gap-2.5 rounded-xl border border-line bg-card px-3 py-2 shadow-lg animate-float-2 hover-float-active cursor-default select-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 text-ink-soft"><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /></svg>
          <div className="text-left">
            <p className="text-[9px] font-bold text-ink">aditya_resume.pdf</p>
            <p className="text-[8px] text-green-500 leading-tight font-semibold">Analyzed round targets</p>
          </div>
        </div>

        {/* 3. Target company bubble */}
        <div className="hidden lg:flex absolute left-[-100px] bottom-[28%] z-20 items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 shadow-lg animate-float-3 hover-float-active cursor-default select-none">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[9px]">🎯</span>
          <span className="text-[9px] font-bold text-ink-soft">Amazon Target Loop</span>
        </div>

        {/* 4. Scorecard Check Badge */}
        <div className="hidden lg:flex absolute right-[-90px] bottom-[24%] z-20 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2 shadow-lg animate-float-4 hover-float-active cursor-default select-none">
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-green-100 text-xs text-green-600">✓</span>
          <div className="text-left">
            <p className="text-[9px] font-bold text-ink">DSA Arrays Score</p>
            <p className="text-[8px] font-semibold text-[#16a34a] leading-tight">8.5/10 · PASSED</p>
          </div>
        </div>

        {/* framed dashboard */}
        <div className={`relative rounded-[26px] border border-line bg-card/50 p-2 shadow-[0_40px_90px_-40px_rgba(20,20,40,0.35)] backdrop-blur-sm sm:p-3 hero-mockup-reveal ${active ? "revealed" : ""} delay-500`}>
          {/* Simulated Cursor Co-pilot */}
          {active && (
            <div
              className="absolute transition-all duration-[1000ms] cubic-bezier(0.25, 1, 0.5, 1) pointer-events-none z-30 flex items-center gap-1.5"
              style={{
                left: cursorPath[cursorIdx].x,
                top: cursorPath[cursorIdx].y,
              }}
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-ink drop-shadow-md fill-current">
                <path d="M4.5 3V17.5L9.2 12.8L14.7 18.3L17.5 15.5L12 10L16.7 5.3L4.5 3Z" />
              </svg>
              <span className="rounded-full bg-ink text-page font-semibold text-[8px] px-1.5 py-0.5 shadow-md whitespace-nowrap animate-pulse">
                {cursorPath[cursorIdx].label}
              </span>
            </div>
          )}
          <HeroDashboard activeCard={cursorPath[cursorIdx].activeCard} />
        </div>
      </div>
    </section>
  );
}
