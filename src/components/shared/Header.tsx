"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./Logo";

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
  const { theme, setTheme } = useTheme();

  const links = user ? studentLinks : publicLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-foreground/8">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-[13px] font-medium uppercase tracking-[0.15em] transition-colors hover:text-primary ${
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
              className="font-heading text-[13px] font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <form action="/api/auth/signout" method="POST">
              <Button variant="ghost" size="sm" type="submit">
                Sign Out
              </Button>
            </form>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
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
          <SheetContent side="right" className="w-[300px]">
            <div className="mt-8 flex flex-col gap-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`font-heading text-xl font-light uppercase tracking-[0.15em] transition-colors hover:text-primary ${
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
                  className="font-heading text-xl font-light uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
                >
                  Admin
                </Link>
              )}
              <div className="mt-4 border-t pt-6">
                {user ? (
                  <form action="/api/auth/signout" method="POST">
                    <Button variant="outline" className="w-full" type="submit">
                      Sign Out
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3">
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

              {/* Theme toggle */}
              <div className="border-t pt-6">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex w-full items-center justify-between rounded-card border px-4 py-3 text-sm transition-colors hover:bg-card"
                >
                  <span className="font-heading text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </span>
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
