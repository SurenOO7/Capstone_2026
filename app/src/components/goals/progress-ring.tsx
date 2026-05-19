import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  label,
  className,
}: Readonly<{
  value: number;
  label?: string;
  className?: string;
}>) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "grid size-32 place-items-center rounded-full",
        className,
      )}
      style={{
        background: `conic-gradient(var(--primary) ${boundedValue * 3.6}deg, var(--secondary) 0deg)`,
      }}
      role="progressbar"
      aria-valuenow={boundedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Goal progress"}
    >
      <div className="grid size-24 place-items-center rounded-full bg-card text-center shadow-sm">
        <div>
          <div className="text-2xl font-semibold">{boundedValue}%</div>
          <div className="text-xs text-muted-foreground">complete</div>
        </div>
      </div>
    </div>
  );
}
