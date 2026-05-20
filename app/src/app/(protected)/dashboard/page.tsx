import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { GoalStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatDate, formatStatus, isOverdue } from "@/lib/goal-utils";

function statCard(
  title: string,
  value: number,
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

function dateKey(date: Date) {
  return date.toISOString().slice(5, 10);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const now = new Date();
  const sevenDays = new Date(now);
  sevenDays.setDate(sevenDays.getDate() + 7);
  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);

  const [goals, progressLogs, completedMilestones] = await Promise.all([
    prisma.goal.findMany({
      where: { userId: session.user.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.progressLog.findMany({
      where: {
        goal: { userId: session.user.id },
        date: { gte: fourteenDaysAgo },
      },
      include: {
        goal: {
          select: { id: true, title: true, unit: true },
        },
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    prisma.milestone.findMany({
      where: {
        completed: true,
        goal: { userId: session.user.id },
      },
      include: {
        goal: {
          select: { id: true, title: true },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
  ]);

  const completed = goals.filter(
    (goal) => goal.status === GoalStatus.COMPLETED,
  ).length;
  const inProgress = goals.filter(
    (goal) => goal.status === GoalStatus.IN_PROGRESS,
  ).length;
  const overdue = goals.filter((goal) => isOverdue(goal)).length;

  const statusData = Object.values(GoalStatus)
    .map((status) => ({
      name: formatStatus(status),
      value: goals.filter((goal) => goal.status === status).length,
    }))
    .filter((item) => item.value > 0);

  const categoryMap = new Map<string, number>();
  for (const goal of goals) {
    const key = goal.category?.name ?? "Uncategorized";
    categoryMap.set(key, (categoryMap.get(key) ?? 0) + 1);
  }
  const categoryData = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, goals: count }))
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 6);

  const progressMap = new Map<string, number>();
  for (let index = 13; index >= 0; index -= 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - index);
    progressMap.set(dateKey(date), 0);
  }
  for (const log of progressLogs) {
    const key = dateKey(log.date);
    progressMap.set(key, (progressMap.get(key) ?? 0) + log.value);
  }
  const progressData = Array.from(progressMap.entries()).map(([date, value]) => ({
    date,
    value,
  }));

  const recentActivity = [
    ...progressLogs.slice(0, 8).map((log) => ({
      id: `progress-${log.id}`,
      type: "Progress",
      href: `/goals/${log.goal.id}`,
      title: log.goal.title,
      description: `${log.value}${log.goal.unit ? ` ${log.goal.unit}` : ""} logged`,
      date: log.date,
    })),
    ...completedMilestones.slice(0, 8).map((milestone) => ({
      id: `milestone-${milestone.id}`,
      type: "Milestone",
      href: `/goals/${milestone.goal.id}`,
      title: milestone.goal.title,
      description: milestone.title,
      date: milestone.updatedAt,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const upcomingDeadlines = goals
    .filter(
      (goal) =>
        goal.deadline &&
        goal.deadline >= now &&
        goal.deadline <= sevenDays &&
        goal.status !== GoalStatus.COMPLETED &&
        goal.status !== GoalStatus.CANCELLED,
    )
    .sort((a, b) => a.deadline!.getTime() - b.deadline!.getTime())
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-normal">Goal overview</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Review goal health, recent movement, and deadlines that need attention.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCard("Total goals", goals.length, "All tracked goals", Target)}
        {statCard("Completed", completed, "Finished outcomes", CheckCircle2)}
        {statCard("In progress", inProgress, "Active execution", TrendingUp)}
        {statCard("Overdue", overdue, "Past deadline", CalendarClock)}
      </div>

      <DashboardCharts
        statusData={statusData}
        categoryData={categoryData}
        progressData={progressData}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>
              Latest progress logs and completed milestones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length ? (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex gap-3 rounded-md p-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      {item.type === "Progress" ? (
                        <Activity className="size-4" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        <Badge variant="outline">{item.type}</Badge>
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {formatDate(item.date)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Activity}
                title="No progress logs yet"
                description="Recent activity will appear after progress updates or completed milestones."
                className="min-h-52"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming deadlines</CardTitle>
            <CardDescription>Goals due within 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((goal) => (
                  <Link
                    key={goal.id}
                    href={`/goals/${goal.id}`}
                    className="block rounded-md border border-border p-3 transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{goal.title}</p>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock3 className="size-4" aria-hidden="true" />
                          {formatDate(goal.deadline)}
                        </p>
                      </div>
                      <Badge variant="secondary">{formatStatus(goal.status)}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Clock3}
                title="No upcoming deadlines"
                description="Goals due within the next week will show here as reminder cards."
                className="min-h-52"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
