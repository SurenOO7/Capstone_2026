import {
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  Plus,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/goals/new", label: "New goal", icon: Plus },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card px-4 py-5 lg:block">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CheckCircle2 className="size-4" aria-hidden="true" />
          </span>
          GoalTrack
        </Link>
        <nav className="mt-8 space-y-1" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-semibold lg:hidden"
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
              GoalTrack
            </Link>
            <nav
              className="flex flex-1 items-center gap-1 overflow-x-auto lg:hidden"
              aria-label="Mobile navigation"
            >
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex size-10 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                  title={item.label}
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className={cn("mx-auto w-full max-w-6xl px-4 py-8 lg:px-8", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
