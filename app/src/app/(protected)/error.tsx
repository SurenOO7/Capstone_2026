"use client";

import { AlertTriangle, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ProtectedError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <Card>
      <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-md bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-normal">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          The page could not finish loading. Try again, and your saved goals will
          stay untouched.
        </p>
        {error.digest ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Error reference: {error.digest}
          </p>
        ) : null}
        <Button type="button" className="mt-5" onClick={reset}>
          <RotateCw aria-hidden="true" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
