import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CheckCircle2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold">GoalTrack</span>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-normal">
            Personal goal tracking platform
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Phase 3 establishes the application architecture, authentication
            wiring, responsive shell, and design artifacts before core feature
            development begins.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Open dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-accent hover:text-accent-foreground"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
