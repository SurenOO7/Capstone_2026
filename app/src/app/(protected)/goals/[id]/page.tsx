import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarClock,
  Check,
  Circle,
  Clock3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { DeleteGoalDialog } from "@/components/goals/delete-goal-dialog";
import { ProgressRing } from "@/components/goals/progress-ring";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  calculateProgressStreak,
  formatDate,
  formatPriority,
  formatStatus,
  getCategoryStyle,
  getProgressPercent,
  isOverdue,
  statusOptions,
} from "@/lib/goal-utils";
import { cn } from "@/lib/utils";

import {
  addProgressLog,
  addMilestone,
  deleteMilestone,
  moveMilestone,
  toggleMilestone,
  updateGoalStatus,
} from "../actions";

export default async function GoalDetailPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const goal = await prisma.goal.findFirst({
    where: { id, userId: session.user.id },
    include: {
      category: true,
      milestones: {
        orderBy: { order: "asc" },
      },
      progressLogs: {
        orderBy: { date: "desc" },
        take: 90,
      },
    },
  });

  if (!goal) {
    redirect("/goals");
  }

  const progress = getProgressPercent(goal);
  const streak = calculateProgressStreak(
    goal.progressLogs.map((log) => log.date),
  );
  const completedMilestones = goal.milestones.filter(
    (milestone) => milestone.completed,
  ).length;
  const statusAction = updateGoalStatus.bind(null, goal.id);
  const milestoneAction = addMilestone.bind(null, goal.id);
  const progressAction = addProgressLog.bind(null, goal.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isOverdue(goal) ? "destructive" : "secondary"}>
              {isOverdue(goal) ? "Overdue" : formatStatus(goal.status)}
            </Badge>
            <Badge variant="outline">{formatPriority(goal.priority)}</Badge>
            {goal.category ? (
              <span
                className="inline-flex rounded-md border px-2.5 py-0.5 text-xs font-medium"
                style={getCategoryStyle(goal.category)}
              >
                {goal.category.name}
              </span>
            ) : null}
          </div>
          <div className="space-y-2">
            <h1 className="max-w-3xl text-3xl font-semibold tracking-normal">
              {goal.title}
            </h1>
            {goal.description ? (
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                {goal.description}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/goals/${goal.id}/edit`}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <Pencil aria-hidden="true" />
              Edit
            </Link>
            <DeleteGoalDialog goalId={goal.id} title={goal.title} />
          </div>
        </div>
        <Card className="w-full lg:w-72">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <ProgressRing value={progress} />
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Current</span>
                <span className="font-medium">
                  {goal.currentValue}
                  {goal.unit ? ` ${goal.unit}` : ""}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium">
                  {goal.targetValue ?? "Not set"}
                  {goal.targetValue && goal.unit ? ` ${goal.unit}` : ""}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <CardDescription>
                {completedMilestones}/{goal.milestones.length} completed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form action={milestoneAction} className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
                <div className="space-y-2">
                  <Label htmlFor="milestoneTitle">Milestone</Label>
                  <Input
                    id="milestoneTitle"
                    name="title"
                    placeholder="Finish first training block"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="milestoneDueDate">Due date</Label>
                  <Input id="milestoneDueDate" name="dueDate" type="date" />
                </div>
                <div className="flex items-end">
                  <Button type="submit" className="w-full">
                    <Plus aria-hidden="true" />
                    Add
                  </Button>
                </div>
              </form>

              {goal.milestones.length ? (
                <div className="divide-y divide-border rounded-lg border border-border">
                  {goal.milestones.map((milestone, index) => (
                    <div
                      key={milestone.id}
                      className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]"
                    >
                      <div className="flex min-w-0 gap-3">
                        <form
                          action={toggleMilestone.bind(
                            null,
                            milestone.id,
                            !milestone.completed,
                          )}
                        >
                          <Button
                            type="submit"
                            variant={milestone.completed ? "default" : "outline"}
                            size="icon"
                            aria-label={
                              milestone.completed
                                ? "Mark milestone incomplete"
                                : "Mark milestone complete"
                            }
                          >
                            {milestone.completed ? (
                              <Check aria-hidden="true" />
                            ) : (
                              <Circle aria-hidden="true" />
                            )}
                          </Button>
                        </form>
                        <div className="min-w-0 space-y-1">
                          <p
                            className={cn(
                              "font-medium",
                              milestone.completed &&
                                "text-muted-foreground line-through",
                            )}
                          >
                            {milestone.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Due {formatDate(milestone.dueDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <form action={moveMilestone.bind(null, milestone.id, "up")}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            disabled={index === 0}
                            aria-label="Move milestone up"
                          >
                            <ArrowUp aria-hidden="true" />
                          </Button>
                        </form>
                        <form
                          action={moveMilestone.bind(null, milestone.id, "down")}
                        >
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            disabled={index === goal.milestones.length - 1}
                            aria-label="Move milestone down"
                          >
                            <ArrowDown aria-hidden="true" />
                          </Button>
                        </form>
                        <form action={deleteMilestone.bind(null, milestone.id)}>
                          <Button
                            type="submit"
                            variant="ghost"
                            size="icon"
                            aria-label="Delete milestone"
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Add milestones to turn this goal into concrete steps.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress history</CardTitle>
              <CardDescription>Latest progress updates for this goal.</CardDescription>
            </CardHeader>
            <CardContent>
              {goal.progressLogs.length ? (
                <div className="space-y-4">
                  {goal.progressLogs.slice(0, 12).map((log) => (
                    <div key={log.id} className="relative flex gap-3">
                      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground ring-4 ring-card">
                        <Clock3 className="size-4" aria-hidden="true" />
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {log.value}
                          {goal.unit ? ` ${goal.unit}` : ""} logged
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(log.date)}
                        </p>
                        {log.note ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            {log.note}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  Progress updates will appear here after the first check-in.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Log progress</CardTitle>
              <CardDescription>
                Update the current value and keep a dated history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={progressAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="value">
                    Current value{goal.unit ? ` (${goal.unit})` : ""}
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={goal.currentValue}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    name="note"
                    placeholder="What changed since the last update?"
                    className="min-h-20"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Activity aria-hidden="true" />
                  Save progress
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Move this goal through its lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={statusAction} className="space-y-3">
                <Label htmlFor="status">Goal status</Label>
                <Select id="status" name="status" defaultValue={goal.status}>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
                <Button type="submit" variant="secondary" className="w-full">
                  Update status
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>Planning metadata and dates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  Deadline
                </span>
                <span className="font-medium">{formatDate(goal.deadline)}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Milestone progress</span>
                  <span className="font-medium">
                    {completedMilestones}/{goal.milestones.length}
                  </span>
                </div>
                <Progress
                  value={
                    goal.milestones.length
                      ? Math.round(
                          (completedMilestones / goal.milestones.length) * 100,
                        )
                      : 0
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Current streak</span>
                <span className="font-medium">
                  {streak} {streak === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(goal.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">{formatDate(goal.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
