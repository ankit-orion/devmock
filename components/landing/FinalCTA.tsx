import { CtaButton } from "@/components/ui/CtaButton";

export function FinalCTA() {
  return (
    <section id="support" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-20">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <h2 className="font-serif text-3xl font-medium leading-[1.1] tracking-tight text-ink sm:text-4xl">
          Practice real interviews, land your dream role
        </h2>
        <div className="md:pl-6">
          <p className="text-sm leading-6 text-ink-soft">
            Run a full mock interview tailored to your target company and role in
            minutes. Get scored, get feedback, and walk in ready.
          </p>
          <div className="mt-5">
            <CtaButton href="/sign-up">Start Practicing</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
