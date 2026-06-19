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
    <div className="relative min-h-screen bg-page">
      {/* page-level pastel mesh — sits behind both the navbar and the hero so they blend seamlessly */}
      <div
        className="hero-mesh pointer-events-none absolute inset-x-0 top-0 h-[760px]"
        aria-hidden
      />
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
