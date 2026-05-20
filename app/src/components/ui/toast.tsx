"use client";

import { CheckCircle2, X } from "lucide-react";
import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  description?: string;
};

const ToastContext = createContext<{
  showToast: (toast: Omit<Toast, "id">) => void;
}>({
  showToast: () => undefined,
});

export function ToastProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...toast, id }].slice(-4));
      window.setTimeout(() => removeToast(id), 4200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 grid w-[calc(100%-2rem)] gap-3 sm:w-96">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "animate-in rounded-lg border border-border bg-card p-4 text-card-foreground shadow-lg",
              "grid grid-cols-[auto_1fr_auto] gap-3",
            )}
            role="status"
          >
            <CheckCircle2 className="mt-0.5 size-5 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-medium">{toast.title}</p>
              {toast.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {toast.description}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
