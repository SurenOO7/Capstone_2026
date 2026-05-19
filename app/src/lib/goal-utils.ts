import {
  GoalPriority,
  GoalStatus,
  type Category,
  type Goal,
} from "@/generated/prisma/client";

export const priorityOptions = [
  { value: GoalPriority.LOW, label: "Low" },
  { value: GoalPriority.MEDIUM, label: "Medium" },
  { value: GoalPriority.HIGH, label: "High" },
  { value: GoalPriority.URGENT, label: "Urgent" },
] as const;

export const statusOptions = [
  { value: GoalStatus.NOT_STARTED, label: "Not started" },
  { value: GoalStatus.IN_PROGRESS, label: "In progress" },
  { value: GoalStatus.COMPLETED, label: "Completed" },
  { value: GoalStatus.PAUSED, label: "Paused" },
  { value: GoalStatus.CANCELLED, label: "Cancelled" },
] as const;

export const sortOptions = [
  { value: "date-desc", label: "Newest" },
  { value: "date-asc", label: "Oldest" },
  { value: "priority", label: "Priority" },
  { value: "deadline", label: "Deadline" },
] as const;

const priorityWeight: Record<GoalPriority, number> = {
  [GoalPriority.LOW]: 1,
  [GoalPriority.MEDIUM]: 2,
  [GoalPriority.HIGH]: 3,
  [GoalPriority.URGENT]: 4,
};

export function formatStatus(status: GoalStatus) {
  return statusOptions.find((option) => option.value === status)?.label ?? status;
}

export function formatPriority(priority: GoalPriority) {
  return (
    priorityOptions.find((option) => option.value === priority)?.label ?? priority
  );
}

export function getProgressPercent(
  goal: Pick<Goal, "currentValue" | "targetValue" | "status">,
) {
  if (goal.status === GoalStatus.COMPLETED) {
    return 100;
  }

  if (!goal.targetValue || goal.targetValue <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100)),
  );
}

export function isOverdue(goal: Pick<Goal, "deadline" | "status">) {
  return (
    Boolean(goal.deadline) &&
    goal.deadline! < new Date() &&
    goal.status !== GoalStatus.COMPLETED &&
    goal.status !== GoalStatus.CANCELLED
  );
}

export function formatDate(date: Date | null | undefined) {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function comparePriority(a: GoalPriority, b: GoalPriority) {
  return priorityWeight[b] - priorityWeight[a];
}

export function getCategoryStyle(category?: Pick<Category, "color"> | null) {
  return {
    backgroundColor: category?.color ? `${category.color}1A` : undefined,
    borderColor: category?.color ?? undefined,
    color: category?.color ?? undefined,
  };
}

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function calculateProgressStreak(logDates: Date[]) {
  if (!logDates.length) {
    return 0;
  }

  const daysWithProgress = new Set(logDates.map(dayKey));
  const cursor = new Date();
  let streak = 0;

  if (!daysWithProgress.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (daysWithProgress.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
