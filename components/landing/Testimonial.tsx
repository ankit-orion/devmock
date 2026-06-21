"use client";

import { useReveal } from "./useReveal";

export function Testimonial() {
  const [revealRef, revealed] = useReveal();

  return (
    <section id="company" ref={revealRef} className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        {/* Person card */}
        <div className="md:col-span-4">
          <div className={`rounded-2xl border border-line bg-surface/30 p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_24px_50px_-30px_rgba(20,20,40,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),_0_32px_60px_-35px_rgba(20,20,40,0.4)] transition-all duration-300 reveal-fade-up ${revealed ? "revealed" : ""} delay-100`}>
            <div className="overflow-hidden rounded-xl border border-line bg-card shadow-[0_2px_6px_rgba(20,20,40,0.02)]">
              {/* Top: Photo */}
              <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                <img
                  src="/priya_sharma.png"
                  alt="Priya Sharma"
                  className="h-full w-full object-cover object-top opacity-85 transition-all hover:scale-105 hover:opacity-100 duration-500"
                />
                {/* Info Badge overlaid at bottom */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-white/10 bg-black/60 p-3 backdrop-blur-md">
                  <p className="text-xs font-bold text-white">Priya Sharma</p>
                  <p className="text-[10px] text-white/70">Placed at Amazon · SDE II</p>
                </div>
              </div>
              {/* Bottom: Increase stats */}
              <div className="p-4 bg-card border-t border-line flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-muted">
                    Salary Increase
                  </p>
                  <p className="font-serif text-3xl font-medium tracking-tight text-ink mt-0.5">
                    +$85k
                  </p>
                </div>
                <span className="rounded-full bg-[#8bd5a0]/15 px-3 py-1 text-[10px] font-bold text-[#16a34a] shadow-sm">
                  Hired
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className={`relative md:col-span-8 flex flex-col justify-center min-h-[220px] reveal-fade-up ${revealed ? "revealed" : ""} delay-250`}>
          <p className="text-lg leading-8 text-ink-soft sm:text-xl sm:leading-9">
            <span className="font-semibold text-ink">
              devmock was a game changer for my prep.
            </span>{" "}
            Before it, I was grinding random LeetCode with no structure. With
            company-specific rounds and brutally honest feedback, I walked into
            my Amazon loop knowing exactly what to expect: the follow-ups, the
            Leadership Principle questions, all of it. I landed the offer.
          </p>
          <span className="absolute bottom-[-20px] right-2 -z-10 text-[10rem] font-serif leading-none text-line/20 select-none pointer-events-none font-bold">
            &rdquo;
          </span>
        </div>
      </div>
    </section>
  );
}
