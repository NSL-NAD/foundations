"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/orders", label: "Kit Orders", icon: Package },
];

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    const stored = localStorage.getItem("admin-sidebar-collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapsed() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("admin-sidebar-collapsed", String(next));
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden flex-shrink-0 flex-col border-r bg-card transition-[width] duration-200 md:flex",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex h-14 items-center border-b",
            collapsed ? "justify-center px-2" : "px-4"
          )}
        >
          {collapsed ? (
            <span className="font-heading text-sm font-semibold">A</span>
          ) : (
            <h2 className="text-sm font-semibold">Admin</h2>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 space-y-1 p-2">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <hr className="my-2" />
          <Link
            href="/"
            title={collapsed ? "View Site" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>View Site</span>}
          </Link>
        </nav>

        {/* Bottom actions */}
        <div
          className={cn(
            "border-t p-2",
            collapsed ? "flex flex-col items-center gap-1" : "flex items-center justify-between"
          )}
        >
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b bg-card px-4 md:hidden">
        {adminNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors hover:text-foreground",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
