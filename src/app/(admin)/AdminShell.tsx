"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  UserCheck,
  Package,
  Star,
  ExternalLink,
  Pin,
  PinOff,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/new-students", label: "New Students", icon: UserPlus },
  { href: "/admin/trial-users", label: "Trial Users", icon: UserCheck },
  { href: "/admin/orders", label: "Kit Orders", icon: Package },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-pinned");
    if (stored === "true") setPinned(true);
  }, []);

  function togglePinned() {
    const next = !pinned;
    setPinned(next);
    localStorage.setItem("admin-sidebar-pinned", String(next));
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar — icon-only, expands on hover or pin */}
      <aside
        className={cn(
          "group hidden flex-shrink-0 flex-col bg-[#1a1a1a] text-white transition-all duration-300 ease-in-out md:flex",
          pinned ? "w-56" : "w-16 hover:w-56"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center px-4">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded border border-white/20">
            <span className="font-heading text-xs font-semibold tracking-widest">
              FA
            </span>
          </div>
          <span
            className={cn(
              "ml-3 font-heading text-xs font-medium uppercase tracking-[0.2em] transition-opacity duration-200",
              pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
          >
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 px-2 pt-4">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!pinned ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                <span
                  className={cn(
                    "whitespace-nowrap transition-opacity duration-200",
                    pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
          <div className="my-3 border-t border-white/10" />
          <Link
            href="/"
            title={!pinned ? "View Site" : undefined}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span
              className={cn(
                "whitespace-nowrap transition-opacity duration-200",
                pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              View Site
            </span>
          </Link>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-white/10 p-2">
          <div className="flex items-center justify-center gap-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePinned}
              aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
              className={cn(
                "text-white/50 hover:bg-white/10 hover:text-white transition-opacity duration-200",
                pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              {pinned ? (
                <PinOff className="h-4 w-4" />
              ) : (
                <Pin className="h-4 w-4" />
              )}
            </Button>
            <form action="/api/auth/signout" method="POST">
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                aria-label="Sign out"
                className={cn(
                  "text-white/50 hover:bg-white/10 hover:text-white transition-opacity duration-200",
                  pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="sticky top-0 z-10 flex h-12 w-full items-center gap-4 border-b bg-[#1a1a1a] px-4 text-white md:hidden">
        {adminNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider transition-colors",
                isActive ? "text-primary" : "text-white/50 hover:text-white/80"
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <form action="/api/auth/signout" method="POST">
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              aria-label="Sign out"
              className="text-white/50 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </div>

      {/* Content */}
      <main className="min-w-0 flex-1 bg-background">{children}</main>
    </div>
  );
}
