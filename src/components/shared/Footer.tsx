import Link from "next/link";
import { Logo } from "./Logo";

const footerLinks = {
  course: [
    { href: "/#curriculum", label: "Curriculum" },
    { href: "/#pricing", label: "Pricing" },
    { href: "/#faq", label: "FAQ" },
  ],
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/refund", label: "Refund Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo linkTo="/" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Learn architecture fundamentals and design your dream home.
              No degree required.
            </p>
          </div>

          {/* Course Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Course</h3>
            <ul className="space-y-2">
              {footerLinks.course.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Foundations of Architecture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
