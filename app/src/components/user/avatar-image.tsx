import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */
export function AvatarImage({
  src,
  name,
  className,
}: Readonly<{
  src?: string | null;
  name: string;
  className?: string;
}>) {
  const initials = name
    .split(" ")
    .map((part) => part.at(0))
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={`${name} avatar`}
        className={cn(
          "size-10 rounded-md border border-border object-cover shadow-sm",
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground",
        className,
      )}
      aria-label={`${name} avatar`}
    >
      {initials || <UserRound className="size-4" aria-hidden="true" />}
    </span>
  );
}
