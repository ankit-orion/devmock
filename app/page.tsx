import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Testimonial } from "@/components/landing/Testimonial";
import { Solution } from "@/components/landing/Solution";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { DemoProvider } from "@/components/landing/demo/DemoContext";

export default function Home() {
  return (
    <DemoProvider>
    <div className="relative min-h-screen overflow-hidden bg-page text-ink selection:bg-ink/10">
      {/* Background decoration layer */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* Top radial hero mesh */}
        <div className="absolute inset-x-0 top-0 h-[800px] hero-mesh opacity-65 dark:opacity-40" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 dot-grid opacity-75 dark:opacity-[0.45]" />
        {/* Blur accent blobs along page flow */}
        <div className="absolute top-[1400px] left-[5%] h-[600px] w-[600px] rounded-full bg-zinc-400/5 blur-[120px] dark:bg-zinc-500/3" />
        <div className="absolute top-[2200px] right-[5%] h-[600px] w-[600px] rounded-full bg-zinc-400/5 blur-[120px] dark:bg-zinc-500/3" />
        <div className="absolute top-[3200px] left-[10%] h-[500px] w-[500px] rounded-full bg-zinc-400/5 blur-[100px] dark:bg-zinc-500/3" />
      </div>

      <Navbar />
      <main>
        <Hero />
        <Integrations />
        <Testimonial />
        <Solution />
        <FinalCTA />
      </main>
      <Footer />
    </div>
    </DemoProvider>
  );
}
