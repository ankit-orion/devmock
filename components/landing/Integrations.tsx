import { Logo } from "@/components/ui/Logo";
import { BrandMark, type BrandName } from "@/components/ui/BrandMark";

function BrandChip({
  name,
  className = "",
}: {
  name: BrandName;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-2.5 shadow-[0_8px_20px_-14px_rgba(0,0,0,0.3)] ${className}`}
    >
      <BrandMark name={name} iconClassName="text-ink" />
    </div>
  );
}

function Diagram() {
  return (
    <>
      {/* desktop diagram */}
      <div className="relative mx-auto hidden h-[260px] w-full max-w-2xl md:block">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-line"
          aria-hidden
        >
          <path d="M24 16 C 36 16, 40 40, 47 47" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M24 84 C 36 84, 40 60, 47 53" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M76 16 C 64 16, 60 40, 53 47" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M76 84 C 64 84, 60 60, 53 53" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </svg>

        <BrandChip name="Amazon" className="absolute left-0 top-2" />
        <BrandChip name="Google" className="absolute bottom-2 left-0" />
        <BrandChip name="Meta" className="absolute right-0 top-2" />
        <BrandChip name="Microsoft" className="absolute bottom-2 right-0" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-3 sheen">
            <Logo tone="white" />
          </div>
        </div>
      </div>

      {/* mobile fallback */}
      <div className="md:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BrandChip name="Amazon" />
          <BrandChip name="Google" />
        </div>
        <div className="my-3 flex justify-center">
          <div className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#3b3b41] to-[#161619] px-5 py-3 sheen">
            <Logo tone="white" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <BrandChip name="Meta" />
          <BrandChip name="Microsoft" />
        </div>
      </div>
    </>
  );
}

const features = [
  {
    label: "Company-specific rounds",
    icon: "M3 7h18M3 12h18M3 17h18",
    desc: "Pick a company and devmock recreates its real interview loop — rounds, focus areas and format.",
    preview: (
      <div className="flex flex-col gap-1.5">
        {[
          { n: "Online Assessment", t: "Coding", c: "#a78bfa" },
          { n: "Phone Screen", t: "Behavioral", c: "#7aa2f7" },
          { n: "Onsite — System Design", t: "Design", c: "#f5a97f" },
          { n: "Bar Raiser", t: "Leadership", c: "#8bd5a0" },
        ].map((r) => (
          <div key={r.n} className="flex items-center gap-2 rounded-lg border border-line bg-[#fbfbfc] px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: r.c }} />
            <span className="flex-1 truncate text-[10px] font-medium text-ink">{r.n}</span>
            <span className="text-[8px] text-muted">{r.t}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Adaptive follow-ups",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    desc: "Answer well and it digs deeper. The AI reads each response and probes exactly where you're weak.",
    preview: (
      <div className="flex flex-col gap-2">
        <div className="max-w-[85%] self-start rounded-lg rounded-bl-sm bg-[#f1f0f4] px-2.5 py-1.5 text-[9px] leading-snug text-ink-soft">
          Walk me through your caching approach.
        </div>
        <div className="max-w-[85%] self-end rounded-lg rounded-br-sm bg-gradient-to-b from-[#3b3b41] to-[#161619] px-2.5 py-1.5 text-[9px] leading-snug text-white/90">
          I used Redis with a TTL...
        </div>
        <div className="max-w-[90%] self-start rounded-lg rounded-bl-sm bg-[#f1f0f4] px-2.5 py-1.5 text-[9px] leading-snug text-ink-soft">
          Good. How would you handle cache invalidation under high write load?
        </div>
      </div>
    ),
  },
  {
    label: "Resume-based questions",
    icon: "M7 3h7l4 4v14H7zM14 3v4h4",
    desc: "Upload your resume and get grilled on your actual projects, tech choices and trade-offs.",
    preview: (
      <div className="flex flex-col gap-2">
        <div className="rounded-lg border border-line bg-[#fbfbfc] p-2">
          <p className="text-[9px] font-semibold text-ink">Realtime Chat App</p>
          <p className="mt-0.5 text-[8px] text-muted">WebSockets · Redis · Node.js</p>
        </div>
        <div className="rounded-lg border border-dashed border-[#a78bfa]/40 bg-[#a78bfa]/5 p-2">
          <p className="text-[9px] leading-snug text-ink-soft">
            &ldquo;You used WebSockets here — how did you handle dropped
            connections and message ordering?&rdquo;
          </p>
        </div>
      </div>
    ),
  },
];

export function Integrations() {
  return (
    <section id="product" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl font-medium leading-[1.12] tracking-tight text-ink sm:text-4xl">
          Practice the interview you&apos;re actually walking into
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink-soft">
          Pick a company you&apos;re targeting, and devmock recreates the
          interview behind the scenes.
        </p>
      </div>

      <div className="mt-12">
        <Diagram />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.label}
            className="flex flex-col rounded-2xl border border-line bg-white p-4 shadow-[0_20px_40px_-28px_rgba(20,20,40,0.25)]"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-line bg-[#fbfbfc]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-ink">
                  <path d={f.icon} />
                </svg>
              </span>
              <h3 className="text-sm font-semibold text-ink">{f.label}</h3>
            </div>
            <p className="mt-2.5 text-xs leading-5 text-ink-soft">{f.desc}</p>
            <div className="mt-4 rounded-xl border border-line bg-white p-2.5">
              {f.preview}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
