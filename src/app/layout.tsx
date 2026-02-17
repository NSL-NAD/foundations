import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
    "Learn architecture fundamentals for $47. 62 lessons, two learning paths, 34 downloadable resources. No degree required.",
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
      "Design your dream home for $47, not $200K. Learn architecture fundamentals with no degree required.",
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
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
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
        </ThemeProvider>
      </body>
    </html>
  );
}
