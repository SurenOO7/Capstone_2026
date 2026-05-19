import { Plus, Search, Target } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { GoalCard } from "@/components/goals/goal-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { GoalPriority, GoalStatus, Prisma } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cn } from "@/lib/utils";
import {
  comparePriority,
  sortOptions,
  statusOptions,
  priorityOptions,
} from "@/lib/goal-utils";

function buildCategoryHref(categoryId?: string) {
  const params = new URLSearchParams();
  if (categoryId) {
    params.set("category", categoryId);
  }

  const query = params.toString();
  return query ? `/goals?${query}` : "/goals";
}

export default async function GoalsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }>;
}>) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const selectedStatus = Object.values(GoalStatus).includes(
    params.status as GoalStatus,
  )
    ? (params.status as GoalStatus)
    : "";
  const selectedPriority = Object.values(GoalPriority).includes(
    params.priority as GoalPriority,
  )
    ? (params.priority as GoalPriority)
    : "";
  const selectedSort = params.sort ?? "date-desc";

  const where: Prisma.GoalWhereInput = {
    userId: session.user.id,
    ...(params.category ? { categoryId: params.category } : {}),
    ...(selectedStatus ? { status: selectedStatus } : {}),
    ...(selectedPriority ? { priority: selectedPriority } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [categories, goalsResult] = await Promise.all([
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
    prisma.goal.findMany({
      where,
      include: {
        category: true,
        milestones: {
          select: { completed: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy:
        selectedSort === "deadline"
          ? { deadline: "asc" }
          : selectedSort === "date-asc"
            ? { createdAt: "asc" }
            : { createdAt: "desc" },
    }),
  ]);

  const goals =
    selectedSort === "priority"
      ? [...goalsResult].sort((a, b) => comparePriority(a.priority, b.priority))
      : goalsResult;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Goals</p>
          <h1 className="text-3xl font-semibold tracking-normal">Goal list</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Scan active goals, filter by category or status, and open any goal
            for milestones and progress history.
          </p>
        </div>
        <Link
          href="/goals/new"
          className={cn(buttonVariants(), "shrink-0")}
        >
          <Plus aria-hidden="true" />
          New goal
        </Link>
      </div>

      <form
        action="/goals"
        className="grid gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:grid-cols-[1.4fr_repeat(4,1fr)_auto]"
      >
        <div className="space-y-2">
          <Label htmlFor="q">Search</Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="Title or description"
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select id="category" name="category" defaultValue={params.category ?? ""}>
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={selectedStatus}>
            <option value="">All</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" name="priority" defaultValue={selectedPriority}>
            <option value="">All</option>
            {priorityOptions.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort">Sort</Label>
          <Select id="sort" name="sort" defaultValue={selectedSort}>
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            Apply
          </Button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildCategoryHref()}
          className={cn(
            buttonVariants({
              variant: params.category ? "outline" : "secondary",
              size: "sm",
            }),
          )}
        >
          All categories
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildCategoryHref(category.id)}
            className={cn(
              buttonVariants({
                variant: params.category === category.id ? "secondary" : "outline",
                size: "sm",
              }),
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {goals.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No goals found"
          description="Create your first goal or adjust the filters to bring existing goals back into view."
        >
          <Link href="/goals/new" className={cn(buttonVariants())}>
            <Plus aria-hidden="true" />
            New goal
          </Link>
        </EmptyState>
      )}
    </div>
  );
}
