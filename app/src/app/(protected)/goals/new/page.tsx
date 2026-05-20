import { redirect } from "next/navigation";

import { GoalForm } from "@/components/goals/goal-form";
import { GoalTemplatePicker } from "@/components/goals/goal-template-picker";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getGoalTemplate } from "@/lib/goal-templates";

import { createGoal } from "../actions";

const errorMessages: Record<string, string> = {
  TitleRequired: "Goal title is required.",
};

export default async function NewGoalPage({
  searchParams,
}: Readonly<{
    searchParams: Promise<{ error?: string; template?: string }>;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [params, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ]);
  const selectedTemplate = getGoalTemplate(params.template);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">New goal</p>
        <h1 className="text-3xl font-semibold tracking-normal">Create goal</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Define a measurable target, assign priority, and add milestones after
          saving.
        </p>
      </div>
      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-normal">Start from a template</h2>
          <p className="text-sm text-muted-foreground">
            Pick a predefined goal structure, then customize the details before saving.
          </p>
        </div>
        <GoalTemplatePicker selectedTemplateId={selectedTemplate?.id} />
      </section>
      <GoalForm
        title="Goal details"
        description="Use a clear title, measurable target, and realistic deadline."
        action={createGoal}
        categories={categories}
        submitLabel="Create goal"
        error={params.error ? errorMessages[params.error] : undefined}
        templateId={selectedTemplate?.id}
        defaults={
          selectedTemplate
            ? {
                title: selectedTemplate.title,
                description: selectedTemplate.goalDescription,
                targetValue: selectedTemplate.targetValue,
                unit: selectedTemplate.unit,
                priority: selectedTemplate.priority,
              }
            : undefined
        }
      />
    </div>
  );
}
