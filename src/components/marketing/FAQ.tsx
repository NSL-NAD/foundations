"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need any prior architecture knowledge?",
    answer:
      "Not at all. This course is designed for complete beginners. Whether you're planning your first home or just curious about how buildings work, you'll find the content approachable and practical.",
  },
  {
    question: "What's the difference between the Drawer and Brief Builder paths?",
    answer:
      "The Drawer path focuses on hands-on sketching — you'll learn to draw floor plans, elevations, and more. The Brief Builder path focuses on writing a comprehensive architectural brief that documents your dream home in detail. Both paths cover the same core knowledge, just through different exercises. You can switch between paths at any time.",
  },
  {
    question: "How long do I have access to the course?",
    answer:
      "Founding students (the first 1,000 enrollments) receive lifetime access to all current and future course content. This includes any new modules, updates, and resources added over time.",
  },
  {
    question: "What's included in the Architecture Starter Kit?",
    answer:
      "The kit includes architectural grid paper, a scaled ruler, a pencil set with eraser and sharpener, an architecture journal for notes and reflections, and a canvas carry pouch. It's everything you need for the Drawer path exercises.",
  },
  {
    question: "What's your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee. If you've completed less than 10% of the course and aren't satisfied, contact us for a full refund. Physical kit items must be returned unopened for kit/bundle refunds.",
  },
  {
    question: "Will this course help me become a licensed architect?",
    answer:
      "This course is not a path to architectural licensure. It's designed to give you the foundational knowledge to design your own living spaces with confidence and to communicate effectively with licensed professionals when you need them.",
  },
  {
    question: "Is the course self-paced?",
    answer:
      "Yes, completely. You can work through the lessons at your own speed. There are no deadlines or live sessions — learn whenever it fits your schedule.",
  },
  {
    question: "Where does the Starter Kit ship?",
    answer:
      "Currently, the Architecture Starter Kit ships to addresses within the United States. Shipping typically takes 3-5 business days. We hope to offer international shipping in the future.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-surface py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Everything you need to know before enrolling.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="rounded-lg border bg-card px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
