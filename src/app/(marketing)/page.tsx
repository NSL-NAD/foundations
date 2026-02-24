import { Hero } from "@/components/marketing/Hero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { CoursePreviewVideo } from "@/components/marketing/CoursePreviewVideo";
import { PathComparison } from "@/components/marketing/PathComparison";
import { CurriculumPreview } from "@/components/marketing/CurriculumPreview";
import { InstructorSection } from "@/components/marketing/InstructorSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { ValueBanner } from "@/components/marketing/ValueBanner";
import { FadeInSection } from "@/components/shared/FadeInSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FadeInSection>
        <ValueProposition />
      </FadeInSection>
      <FadeInSection>
        <CoursePreviewVideo />
      </FadeInSection>
      <FadeInSection>
        <PathComparison />
      </FadeInSection>
      <FadeInSection>
        <CurriculumPreview />
      </FadeInSection>
      <FadeInSection>
        <ValueBanner />
      </FadeInSection>
      <FadeInSection>
        <InstructorSection />
      </FadeInSection>
      <FadeInSection>
        <Testimonials />
      </FadeInSection>
      <FadeInSection>
        <PricingCards />
      </FadeInSection>
      <FadeInSection>
        <FAQ />
      </FadeInSection>
      <FadeInSection>
        <FinalCTA />
      </FadeInSection>
    </>
  );
}
