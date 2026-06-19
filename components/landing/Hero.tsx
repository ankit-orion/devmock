import { CtaButton } from "@/components/ui/CtaButton";
import { BrandMark, type BrandName } from "@/components/ui/BrandMark";
import { HeroDashboard } from "./HeroDashboard";

const brands: BrandName[] = ["Amazon", "Google", "Meta", "Microsoft", "Others"];

export function Hero() {
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-5xl px-5 pt-14 pb-14 text-center sm:px-6 sm:pt-20 sm:pb-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted sm:text-[11px]">
          AI-Powered Mock Interviews
        </p>

        <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[2rem] font-medium leading-[1.1] tracking-tight text-ink sm:mt-5 sm:text-5xl sm:leading-[1.08] md:text-6xl">
          Practice real interviews, land your dream role
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-ink-soft sm:mt-5 sm:text-[15px] sm:leading-7">
          devmock simulates company-specific interviews with an AI that plans
          your rounds, asks the questions you&apos;ll actually face, and gives
          detailed feedback — all tailored to the role you&apos;re targeting.
        </p>

        <div className="mt-6 flex items-center justify-center sm:mt-7">
          <CtaButton href="/sign-up">Start Practicing</CtaButton>
        </div>

        <p className="mx-auto mt-10 max-w-md text-xs leading-5 text-muted sm:mt-12">
          Prepare for interviews at the companies you&apos;re targeting. No
          generic question banks.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-ink-soft/70 sm:gap-x-8">
          {brands.map((brand) => (
            <BrandMark key={brand} name={brand} />
          ))}
        </div>
      </div>

      {/* product mockup */}
      <div className="relative mx-auto max-w-5xl px-4 pb-16 sm:px-6 sm:pb-24">
        <HeroDashboard />
      </div>
    </section>
  );
}
