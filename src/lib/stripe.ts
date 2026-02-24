import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_placeholder", {
  apiVersion: "2026-01-28.clover",
  typescript: true,
});

export const PRODUCTS = {
  course: {
    priceId: process.env.STRIPE_PRICE_COURSE!,
    name: "Foundations of Architecture Course",
    description: "100 lessons, two learning paths, 31 downloadable resources",
  },
  kit: {
    priceId: process.env.STRIPE_PRICE_KIT!,
    name: "Architecture Starter Kit",
    description:
      "Grid paper, ruler, pencils, eraser, sharpener, journal, and pouch",
  },
  bundle: {
    priceId: process.env.STRIPE_PRICE_BUNDLE!,
    name: "Course + Starter Kit Bundle",
    description: "Everything you need — save $12",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
