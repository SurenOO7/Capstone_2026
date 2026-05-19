import { redirect } from "next/navigation";

import { GoalForm } from "@/components/goals/goal-form";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

import { updateGoal } from "../../actions";

const errorMessages: Record<string, string> = {
  TitleRequired: "Goal title is required.",
};

export default async function EditGoalPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [{ id }, query] = await Promise.all([params, searchParams]);
  const [goal, categories] = await Promise.all([
    prisma.goal.findFirst({
      where: { id, userId: session.user.id },
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!goal) {
    redirect("/goals");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Edit goal</p>
        <h1 className="text-3xl font-semibold tracking-normal">{goal.title}</h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Update scope, progress, status, target, or deadline.
        </p>
      </div>
      <GoalForm
        title="Goal details"
        description="Changes apply immediately after saving."
        action={updateGoal.bind(null, goal.id)}
        categories={categories}
        goal={goal}
        submitLabel="Save goal"
        showStatus
        error={query.error ? errorMessages[query.error] : undefined}
      />
    </div>
  );
}
