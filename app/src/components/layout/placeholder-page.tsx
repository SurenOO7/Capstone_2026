export function PlaceholderPage({
  eyebrow,
  title,
  description,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <section className="space-y-4">
      <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="rounded-md border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
        Placeholder for Phase 4 feature implementation.
      </div>
    </section>
  );
}
