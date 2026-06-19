export function Testimonial() {
  return (
    <section id="company" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
        {/* Person card */}
        <div className="md:col-span-4">
          <div className="rounded-2xl border border-line bg-white p-3 shadow-[0_24px_50px_-30px_rgba(20,20,40,0.4)]">
            <div className="flex items-center gap-3 rounded-xl bg-[#fbfbfc] p-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#a78bfa] to-[#7aa2f7] text-sm font-semibold text-white">
                PS
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Priya Sharma</p>
                <p className="text-xs text-muted">SDE II @ Amazon</p>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between px-1">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted">
                  Offers received
                </p>
                <p className="font-serif text-4xl font-medium tracking-tight text-ink">
                  3
                </p>
              </div>
              <span className="mb-1 rounded-full bg-[#8bd5a0]/15 px-2.5 py-1 text-[10px] font-semibold text-[#16a34a]">
                Hired
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="relative md:col-span-8">
          <p className="text-lg leading-8 text-ink sm:text-xl sm:leading-9">
            <span className="font-semibold">
              devmock was a game changer for my prep.
            </span>{" "}
            Before it, I was grinding random LeetCode with no structure. With
            company-specific rounds and brutally honest feedback, I walked into
            my Amazon loop knowing exactly what to expect — the follow-ups, the
            Leadership Principle questions, all of it. I landed the offer.
          </p>
          <svg
            viewBox="0 0 48 48"
            className="ml-auto mt-6 h-12 w-12 text-line"
            fill="currentColor"
            aria-hidden
          >
            <path d="M18 10c-6 2-10 8-10 16v12h14V24h-8c0-5 2-9 6-11zm22 0c-6 2-10 8-10 16v12h14V24h-8c0-5 2-9 6-11z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
