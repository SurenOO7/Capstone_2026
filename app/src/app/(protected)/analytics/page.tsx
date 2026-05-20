import { Activity, CalendarDays, Flame, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GoalStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getProgressPercent } from "@/lib/goal-utils";
import { cn } from "@/lib/utils";

const viewOptions = [
  { value: "weekly", label: "Weekly", days: 7, buckets: 8 },
  { value: "monthly", label: "Monthly", days: 30, buckets: 6 },
  { value: "yearly", label: "Yearly", days: 365, buckets: 12 },
] as const;

type View = (typeof viewOptions)[number]["value"];

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function startOfDay(date: Date) {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function formatBucketLabel(date: Date, view: View) {
  if (view === "yearly") {
    return new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function statCard(
  title: string,
  value: string,
  description: string,
  icon: typeof Target,
) {
  const Icon = icon;

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-normal">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="flex size-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}

function calculateLongestStreak(dates: Date[]) {
  const sortedDays = Array.from(new Set(dates.map(dayKey))).sort();
  let longest = 0;
  let current = 0;
  let previous: Date | null = null;

  for (const day of sortedDays) {
    const currentDate = new Date(`${day}T00:00:00.000Z`);
    const expected = previous ? new Date(previous) : null;
    expected?.setUTCDate(expected.getUTCDate() + 1);

    current = expected && dayKey(expected) === day ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = currentDate;
  }

  return longest;
}

function calculateCurrentStreak(dates: Date[]) {
  const daysWithProgress = new Set(dates.map(dayKey));
  const cursor = startOfDay(new Date());
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

export default async function AnalyticsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ view?: string }>;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const selectedView = viewOptions.some((option) => option.value === params.view)
    ? (params.view as View)
    : "monthly";
  const viewConfig = viewOptions.find((option) => option.value === selectedView)!;
  const now = new Date();
  const rangeStart = new Date(now);
  rangeStart.setDate(rangeStart.getDate() - viewConfig.days * viewConfig.buckets);

  const [goals, progressLogs] = await Promise.all([
    prisma.goal.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.progressLog.findMany({
      where: { goal: { userId: session.user.id } },
      select: { date: true },
      orderBy: { date: "asc" },
    }),
  ]);

  const completionData = Array.from({ length: viewConfig.buckets }, (_, index) => {
    const bucketStart = new Date(rangeStart);
    bucketStart.setDate(bucketStart.getDate() + index * viewConfig.days);
    const bucketEnd = new Date(bucketStart);
    bucketEnd.setDate(bucketEnd.getDate() + viewConfig.days);

    const goalsInBucket = goals.filter((goal) => goal.createdAt < bucketEnd);
    const completedInBucket = goalsInBucket.filter(
      (goal) => goal.status === GoalStatus.COMPLETED && goal.updatedAt < bucketEnd,
    );

    return {
      label: formatBucketLabel(bucketStart, selectedView),
      completionRate: goalsInBucket.length
        ? Math.round((completedInBucket.length / goalsInBucket.length) * 100)
        : 0,
      completed: completedInBucket.length,
      total: goalsInBucket.length,
    };
  });

  const categoryMap = new Map<
    string,
    { category: string; goals: number; completed: number; totalProgress: number }
  >();

  for (const goal of goals) {
    const key = goal.category?.name ?? "Uncategorized";
    const entry = categoryMap.get(key) ?? {
      category: key,
      goals: 0,
      completed: 0,
      totalProgress: 0,
    };
    entry.goals += 1;
    entry.completed += goal.status === GoalStatus.COMPLETED ? 1 : 0;
    entry.totalProgress += getProgressPercent(goal);
    categoryMap.set(key, entry);
  }

  const categoryData = Array.from(categoryMap.values())
    .map((entry) => ({
      category: entry.category,
      goals: entry.goals,
      completed: entry.completed,
      averageProgress: Math.round(entry.totalProgress / entry.goals),
    }))
    .sort((a, b) => b.averageProgress - a.averageProgress)
    .slice(0, 8);

  const logDates = progressLogs.map((log) => log.date);
  const activeDays = new Set(logDates.map(dayKey)).size;
  const completedGoals = goals.filter((goal) => goal.status === GoalStatus.COMPLETED);
  const completionRate = goals.length
    ? Math.round((completedGoals.length / goals.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Analytics</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            Progress analytics
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Track completion trends, category performance, and consistency signals
            across your goal workspace.
          </p>
        </div>
        <div className="flex rounded-md border border-border bg-card p-1">
          {viewOptions.map((option) => (
            <Link
              key={option.value}
              href={`/analytics?view=${option.value}`}
              className={cn(
                buttonVariants({
                  variant: selectedView === option.value ? "secondary" : "ghost",
                  size: "sm",
                }),
                "min-w-20",
              )}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCard(
          "Completion rate",
          `${completionRate}%`,
          `${completedGoals.length}/${goals.length} goals completed`,
          Trophy,
        )}
        {statCard(
          "Current streak",
          `${calculateCurrentStreak(logDates)}`,
          "Consecutive active days",
          Flame,
        )}
        {statCard(
          "Longest streak",
          `${calculateLongestStreak(logDates)}`,
          "Best consistency run",
          Activity,
        )}
        {statCard(
          "Active days",
          `${activeDays}`,
          "Days with progress logs",
          CalendarDays,
        )}
      </div>

      {!goals.length ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Badge variant="secondary">No analytics yet</Badge>
              <p className="font-medium">Create goals to unlock trend analysis.</p>
              <p className="text-sm text-muted-foreground">
                Completion rates, category charts, and streaks are calculated from
                goals and progress logs.
              </p>
            </div>
            <Link href="/goals/new" className={cn(buttonVariants(), "shrink-0")}>
              New goal
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <AnalyticsCharts
        completionData={completionData}
        categoryData={categoryData}
      />
    </div>
  );
}
