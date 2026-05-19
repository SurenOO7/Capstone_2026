import { redirect } from "next/navigation";

import { GoalForm } from "@/components/goals/goal-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

import { createGoal } from "../actions";

const errorMessages: Record<string, string> = {
  TitleRequired: "Goal title is required.",
};

export default async function NewGoalPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ error?: string }>;
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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">New goal</p>
        <h1 className="text-3xl font-semibold tracking-normal">Create goal</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Define a measurable target, assign priority, and add milestones after
          saving.
        </p>
      </div>
      <GoalForm
        title="Goal details"
        description="Use a clear title, measurable target, and realistic deadline."
        action={createGoal}
        categories={categories}
        submitLabel="Create goal"
        error={params.error ? errorMessages[params.error] : undefined}
      />
    </div>
  );
}
