import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "Foundations of Architecture | Design Your Dream Home",
    template: "%s | Foundations of Architecture",
  },
  description:
    "Learn architecture fundamentals for $93. 62 lessons, two learning paths, 34 downloadable resources. No degree required.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3007"),
  openGraph: {
    type: "website",
    siteName: "Foundations of Architecture",
    title: "Foundations of Architecture | Design Your Dream Home",
    description:
      "A beginner-friendly course teaching architectural fundamentals. 62 lessons, two learning paths, 34 downloadable resources.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundations of Architecture",
    description:
      "Design your dream home for $93, not $200K. Learn architecture fundamentals with no degree required.",
  },
  keywords: [
    "architecture course",
    "home design",
    "dream home",
    "architecture fundamentals",
    "floor plans",
    "design your own home",
    "architecture for beginners",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
