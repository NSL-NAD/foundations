"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  user?: { email: string; full_name?: string | null } | null;
  isAdmin?: boolean;
}

const publicLinks = [
  { href: "/#curriculum", label: "Curriculum" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

const studentLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/course", label: "Course" },
  { href: "/account", label: "Account" },
];

export function Header({ user, isAdmin }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = user ? studentLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {user ? (
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/#pricing">Enroll Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <div className="mt-6 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-primary ${
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Admin
                </Link>
              )}
              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <ThemeToggle />
              </div>
              <div className="border-t pt-4">
                {user ? (
                  <form action="/api/auth/signout" method="POST">
                    <Button variant="outline" className="w-full" type="submit">
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login" onClick={() => setOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button asChild className="w-full">
                      <Link href="/#pricing" onClick={() => setOpen(false)}>
                        Enroll Now
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
