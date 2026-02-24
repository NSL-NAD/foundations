import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/shared/CookieConsent";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3007";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Foundations of Architecture",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "An online architecture course teaching homeowners the fundamentals of residential design.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Foundations of Architecture",
  url: siteUrl,
  description:
    "A self-paced online course that teaches architecture fundamentals for homeowners. 100 lessons, two learning paths, 31 downloadable resources.",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Foundations of Architecture | Design Your Dream Home",
    template: "%s | Foundations of Architecture",
  },
  description:
    "Learn architecture fundamentals with this self-paced online course. 100 lessons, two learning paths, 31 downloadable resources. Design your dream home — no degree required.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    siteName: "Foundations of Architecture",
    title: "Foundations of Architecture | Design Your Dream Home",
    description:
      "A beginner-friendly online course teaching residential architecture fundamentals. 100 lessons, two learning paths, 31 downloadable resources.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundations of Architecture",
    description:
      "Design your dream home — not $200K, just $47. Learn architecture fundamentals with this self-paced digital course.",
  },
  keywords: [
    "architecture course",
    "online course",
    "digital course",
    "home design",
    "dream home",
    "architecture fundamentals",
    "residential architecture",
    "floor plans",
    "design your own home",
    "architecture for beginners",
    "architecture for homeowners",
    "self-paced learning",
    "learn architecture",
    "home design course",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-nav">
            Skip to main content
          </a>
          {children}
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
