import type { Metadata } from "next";
import Script from "next/script";
import { Hero } from "@/components/marketing/Hero";
import { ValueProposition } from "@/components/marketing/ValueProposition";
import { CoursePreviewVideo } from "@/components/marketing/CoursePreviewVideo";
import { PathComparison } from "@/components/marketing/PathComparison";
import { DesignBriefPreview } from "@/components/marketing/DesignBriefPreview";
import { CurriculumPreview } from "@/components/marketing/CurriculumPreview";
import { InstructorSection } from "@/components/marketing/InstructorSection";
import { Testimonials } from "@/components/marketing/Testimonials";
import { PricingCards } from "@/components/marketing/PricingCards";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { ValueBanner } from "@/components/marketing/ValueBanner";
import { FadeInSection } from "@/components/shared/FadeInSection";

const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3007";

export const metadata: Metadata = {
  title: "Foundations of Architecture | Online Course — Design Your Dream Home",
  description:
    "A self-paced online architecture course for homeowners. Learn residential design fundamentals — floor plans, elevations, materials, and more. 106 lessons, two learning paths, 31 downloadable resources. No degree required.",
  alternates: {
    canonical: siteUrl,
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Foundations of Architecture",
  description:
    "A self-paced online course teaching residential architecture fundamentals for homeowners. Learn floor plans, elevations, materials, sustainability, and more.",
  provider: {
    "@type": "Organization",
    name: "Foundations of Architecture",
    url: siteUrl,
  },
  educationalLevel: "Beginner",
  numberOfCredits: 0,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    courseWorkload: "PT40H",
  },
  offers: [
    {
      "@type": "Offer",
      price: "47.00",
      priceCurrency: "USD",
      name: "Course Only",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#pricing`,
    },
    {
      "@type": "Offer",
      price: "62.00",
      priceCurrency: "USD",
      name: "Course + Starter Kit",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/#pricing`,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need any prior architecture knowledge?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. This course is designed for complete beginners. Whether you're planning your first home or just curious about how buildings work, you'll find the content approachable and practical.",
      },
    },
    {
      "@type": "Question",
      name: "What's the difference between the Drawer and Brief Builder paths?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Drawer path focuses on hands-on sketching — you'll learn to draw floor plans, elevations, and more. The Brief Builder path focuses on writing a comprehensive architectural brief that documents your dream home in detail. Both paths cover the same core knowledge, just through different exercises. You can switch between paths at any time.",
      },
    },
    {
      "@type": "Question",
      name: "How long do I have access to the course?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Founding students receive lifetime access to all current and future course content. This includes any new modules, updates, and resources added over time.",
      },
    },
    {
      "@type": "Question",
      name: "Is the course self-paced?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely. You can work through the lessons at your own speed. There are no deadlines or live sessions — learn whenever it fits your schedule.",
      },
    },
    {
      "@type": "Question",
      name: "What's your refund policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a 30-day money-back guarantee. If you've completed more than 10% of the course, refunds are no longer available. Otherwise, contact us for a full refund. Physical kit items must be returned unopened for kit/bundle refunds.",
      },
    },
    {
      "@type": "Question",
      name: "Will this course help me become a licensed architect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This course is not a path to architectural licensure. It's designed to give you the foundational knowledge to design your own living spaces with confidence and to communicate effectively with licensed professionals when you need them.",
      },
    },
  ],
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Foundations of Architecture — Online Course",
  description:
    "A beginner-friendly online course teaching residential architecture fundamentals. 106 lessons, two learning paths, and 31 downloadable resources.",
  brand: {
    "@type": "Brand",
    name: "Foundations of Architecture",
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "47.00",
    highPrice: "62.00",
    priceCurrency: "USD",
    offerCount: 2,
    availability: "https://schema.org/InStock",
    url: `${siteUrl}/#pricing`,
  },
};

export default function HomePage() {
  return (
    <>
      <Script
        id="course-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
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
        <DesignBriefPreview />
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
