import { Hero } from "@/components/marketing/Hero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { PathComparison } from "@/components/marketing/PathComparison";
import { CurriculumPreview } from "@/components/marketing/CurriculumPreview";
import { InstructorSection } from "@/components/marketing/InstructorSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProposition />
      <PathComparison />
      <CurriculumPreview />
      <InstructorSection />
      <Testimonials />
      <PricingCards />
      <FAQ />
      <FinalCTA />
    </>
  );
}
