import { BookOpen, Dumbbell, Languages } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { goalTemplates } from "@/lib/goal-templates";

const icons = [BookOpen, Dumbbell, Languages];

export function GoalTemplatePicker({
  selectedTemplateId,
}: Readonly<{
  selectedTemplateId?: string;
}>) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {goalTemplates.map((template, index) => {
        const Icon = icons[index] ?? BookOpen;
        const selected = selectedTemplateId === template.id;

        return (
          <Link
            key={template.id}
            href={`/goals/new?template=${template.id}`}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Card className={selected ? "border-primary bg-accent" : ""}>
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  {selected ? <Badge variant="secondary">Selected</Badge> : null}
                </div>
                <div className="space-y-1">
                  <h2 className="font-semibold tracking-normal">{template.name}</h2>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
