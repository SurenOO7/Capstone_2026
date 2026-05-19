import { CalendarClock, Pencil, Target } from "lucide-react";
import Link from "next/link";

import type { Category, Goal, Milestone } from "@/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  formatDate,
  formatPriority,
  formatStatus,
  getCategoryStyle,
  getProgressPercent,
  isOverdue,
} from "@/lib/goal-utils";

import { DeleteGoalDialog } from "./delete-goal-dialog";

type GoalCardData = Goal & {
  category: Category | null;
  milestones: Pick<Milestone, "completed">[];
};

export function GoalCard({ goal }: Readonly<{ goal: GoalCardData }>) {
  const progress = getProgressPercent(goal);
  const completedMilestones = goal.milestones.filter(
    (milestone) => milestone.completed,
  ).length;

  return (
    <Card className="flex h-full flex-col transition-colors duration-150 hover:border-primary/40">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <Badge variant={isOverdue(goal) ? "destructive" : "secondary"}>
              {isOverdue(goal) ? "Overdue" : formatStatus(goal.status)}
            </Badge>
            <CardTitle className="line-clamp-2">
              <Link
                href={`/goals/${goal.id}`}
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {goal.title}
              </Link>
            </CardTitle>
          </div>
          <Target className="mt-1 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </div>
        {goal.description ? (
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {goal.description}
          </p>
        ) : null}
      </CardHeader>
      <CardContent className="mt-auto space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between gap-3">
            <span>Priority</span>
            <span className="font-medium text-foreground">
              {formatPriority(goal.priority)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Milestones</span>
            <span className="font-medium text-foreground">
              {completedMilestones}/{goal.milestones.length}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="size-4" aria-hidden="true" />
              Deadline
            </span>
            <span className="font-medium text-foreground">
              {formatDate(goal.deadline)}
            </span>
          </div>
        </div>
        {goal.category ? (
          <div
            className="inline-flex rounded-md border px-2.5 py-1 text-xs font-medium"
            style={getCategoryStyle(goal.category)}
          >
            {goal.category.icon ? `${goal.category.icon} ` : ""}
            {goal.category.name}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/goals/${goal.id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil aria-hidden="true" />
            Edit
          </Link>
          <DeleteGoalDialog goalId={goal.id} title={goal.title} size="sm" />
        </div>
      </CardContent>
    </Card>
  );
}
