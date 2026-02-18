import Link from "next/link";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const footerLinks = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
];

export function Footer() {
  return (
    <footer className="bg-[#171C24] text-white">
      <div className="container py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <Logo linkTo="/" inverted />
            <p className="mt-4 text-sm text-white/60">
              Learn architecture fundamentals and design your dream home.
              No degree required.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-[13px] font-medium uppercase tracking-wider text-white/60 transition-colors hover:text-brass"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-8">
          <div className="flex flex-col gap-1">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} Foundations of Architecture. All rights reserved.
            </p>
            <p className="text-[11px] text-white/25">
              Powered by{" "}
              <a
                href="https://www.goodatscale.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/40 transition-colors"
              >
                GAS Studio
              </a>
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
