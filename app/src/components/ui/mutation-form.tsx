"use client";

import * as React from "react";

import { useToast } from "@/components/ui/toast";

type MutationFormProps = React.ComponentProps<"form"> & {
  toastTitle: string;
  toastDescription?: string;
};

export function MutationForm({
  toastTitle,
  toastDescription,
  onSubmit,
  ...props
}: MutationFormProps) {
  const { showToast } = useToast();

  return (
    <form
      {...props}
      onSubmit={(event) => {
        onSubmit?.(event);

        if (!event.defaultPrevented) {
          showToast({
            title: toastTitle,
            description: toastDescription,
          });
        }
      }}
    />
  );
}
