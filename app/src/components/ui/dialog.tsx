"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  children,
  destructive = false,
}: Readonly<{
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  children: React.ReactNode;
  destructive?: boolean;
}>) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 px-4 backdrop-blur-sm"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2
                  id="confirm-dialog-title"
                  className="text-lg font-semibold tracking-normal"
                >
                  {title}
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close dialog"
              >
                <X aria-hidden="true" />
              </Button>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <div
                className={cn(
                  "[&_button]:w-full sm:[&_button]:w-auto",
                  destructive && "[&_button]:bg-destructive",
                )}
              >
                {children}
              </div>
            </div>
            <span className="sr-only">{confirmLabel}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
