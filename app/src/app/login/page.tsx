import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getOAuthProviderAvailability } from "@/lib/oauth-providers";

import {
  loginWithCredentials,
  loginWithProvider,
  registerWithCredentials,
} from "./actions";

const errorMessages: Record<string, string> = {
  CredentialsSignin: "The email or password you entered is not valid.",
  InvalidRegistration:
    "Enter a name, a valid email, and matching passwords with at least 8 characters.",
  EmailExists: "An account with this email already exists. Sign in instead.",
  UnknownProvider: "This sign-in provider is not configured.",
};

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ mode?: string; error?: string; registered?: string }>;
}>) {
  const params = await searchParams;
  const isRegistering = params.mode === "register";
  const error = params.error ? errorMessages[params.error] : null;
  const oauthAvailability = getOAuthProviderAvailability();
  const hasOAuthProviders = oauthAvailability.google;

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <CheckCircle2 className="size-4" aria-hidden="true" />
            </span>
            GoalTrack
          </Link>
          <div className="max-w-xl space-y-4">
            <p className="text-sm font-medium text-primary">Personal progress OS</p>
            <h1 className="text-4xl font-semibold tracking-normal sm:text-5xl">
              Track goals with clear progress, deadlines, and momentum.
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              A focused workspace for personal goals: plan measurable targets,
              break them into milestones, and review progress without clutter.
            </p>
          </div>
          <div className="grid max-w-xl gap-3 sm:grid-cols-3">
            {["OAuth ready", "Server actions", "Protected workspace"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isRegistering ? "Create account" : "Sign in"}</CardTitle>
            <CardDescription>
              {isRegistering
                ? "Use credentials now, or connect OAuth after account creation."
                : "Continue with OAuth or your email and password."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            {params.registered ? (
              <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                Account created. Sign in to continue.
              </div>
            ) : null}

            {hasOAuthProviders ? (
              <div className="grid gap-3">
                {oauthAvailability.google ? (
                  <form action={loginWithProvider}>
                    <input type="hidden" name="provider" value="google" />
                    <Button type="submit" variant="outline" className="w-full">
                      <Mail aria-hidden="true" />
                      Google
                    </Button>
                  </form>
                ) : null}
              </div>
            ) : (
              <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                OAuth providers are not configured. Use email and password for
                now.
              </div>
            )}

            {hasOAuthProviders ? (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    {isRegistering ? "Register with email" : "Sign in with email"}
                  </span>
                </div>
              </div>
            ) : null}

            <form
              action={
                isRegistering ? registerWithCredentials : loginWithCredentials
              }
              className="space-y-4"
            >
              {isRegistering ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" autoComplete="name" required />
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                  minLength={8}
                  required
                />
              </div>
              {isRegistering ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
              ) : null}
              <Button type="submit" className="w-full">
                <KeyRound aria-hidden="true" />
                {isRegistering ? "Create account" : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isRegistering ? "Already have an account?" : "New to GoalTrack?"}{" "}
              <Link
                href={isRegistering ? "/login" : "/login?mode=register"}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {isRegistering ? "Sign in" : "Create one"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
