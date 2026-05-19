"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { GoalPriority, GoalStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || null;
}

function getOptionalNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getOptionalDate(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(`${value}T12:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPriority(formData: FormData) {
  const value = getString(formData, "priority");
  return Object.values(GoalPriority).includes(value as GoalPriority)
    ? (value as GoalPriority)
    : GoalPriority.MEDIUM;
}

function getStatus(formData: FormData) {
  const value = getString(formData, "status");
  return Object.values(GoalStatus).includes(value as GoalStatus)
    ? (value as GoalStatus)
    : GoalStatus.NOT_STARTED;
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

async function assertGoalOwner(goalId: string, userId: string) {
  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    select: { id: true },
  });

  if (!goal) {
    redirect("/goals");
  }
}

function getGoalData(formData: FormData) {
  const targetValue = getOptionalNumber(formData, "targetValue");
  const currentValue = getOptionalNumber(formData, "currentValue");

  return {
    title: getString(formData, "title"),
    description: getOptionalString(formData, "description"),
    categoryId: getOptionalString(formData, "categoryId"),
    priority: getPriority(formData),
    deadline: getOptionalDate(formData, "deadline"),
    targetValue,
    currentValue: currentValue ?? 0,
    unit: getOptionalString(formData, "unit"),
  };
}

export async function createGoal(formData: FormData) {
  const userId = await requireUserId();
  const data = getGoalData(formData);

  if (!data.title) {
    redirect("/goals/new?error=TitleRequired");
  }

  const goal = await prisma.goal.create({
    data: {
      ...data,
      status: data.currentValue > 0 ? GoalStatus.IN_PROGRESS : GoalStatus.NOT_STARTED,
      userId,
    },
    select: { id: true },
  });

  revalidatePath("/goals");
  redirect(`/goals/${goal.id}`);
}

export async function updateGoal(goalId: string, formData: FormData) {
  const userId = await requireUserId();
  await assertGoalOwner(goalId, userId);

  const data = getGoalData(formData);
  const status = getStatus(formData);

  if (!data.title) {
    redirect(`/goals/${goalId}/edit?error=TitleRequired`);
  }

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      ...data,
      status,
    },
  });

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
  redirect(`/goals/${goalId}`);
}

export async function updateGoalStatus(goalId: string, formData: FormData) {
  const userId = await requireUserId();
  await assertGoalOwner(goalId, userId);
  const status = getStatus(formData);

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      status,
      ...(status === GoalStatus.COMPLETED ? { currentValue: undefined } : {}),
    },
  });

  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
}

export async function deleteGoal(goalId: string) {
  const userId = await requireUserId();
  await assertGoalOwner(goalId, userId);

  await prisma.goal.delete({ where: { id: goalId } });

  revalidatePath("/goals");
  redirect("/goals");
}

export async function addMilestone(goalId: string, formData: FormData) {
  const userId = await requireUserId();
  await assertGoalOwner(goalId, userId);
  const title = getString(formData, "title");

  if (!title) {
    redirect(`/goals/${goalId}`);
  }

  const maxOrder = await prisma.milestone.aggregate({
    where: { goalId },
    _max: { order: true },
  });

  await prisma.milestone.create({
    data: {
      goalId,
      title,
      dueDate: getOptionalDate(formData, "dueDate"),
      order: (maxOrder._max.order ?? -1) + 1,
    },
  });

  revalidatePath(`/goals/${goalId}`);
}

export async function toggleMilestone(milestoneId: string, completed: boolean) {
  const userId = await requireUserId();

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, goal: { userId } },
    select: { goalId: true },
  });

  if (!milestone) {
    redirect("/goals");
  }

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { completed },
  });

  revalidatePath(`/goals/${milestone.goalId}`);
  revalidatePath("/dashboard");
}

export async function deleteMilestone(milestoneId: string) {
  const userId = await requireUserId();

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, goal: { userId } },
    select: { goalId: true },
  });

  if (!milestone) {
    redirect("/goals");
  }

  await prisma.milestone.delete({ where: { id: milestoneId } });

  revalidatePath(`/goals/${milestone.goalId}`);
}

export async function moveMilestone(milestoneId: string, direction: "up" | "down") {
  const userId = await requireUserId();

  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, goal: { userId } },
    select: { id: true, goalId: true, order: true },
  });

  if (!milestone) {
    redirect("/goals");
  }

  const adjacent = await prisma.milestone.findFirst({
    where: {
      goalId: milestone.goalId,
      order:
        direction === "up"
          ? { lt: milestone.order }
          : { gt: milestone.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
    select: { id: true, order: true },
  });

  if (!adjacent) {
    return;
  }

  await prisma.$transaction([
    prisma.milestone.update({
      where: { id: milestone.id },
      data: { order: -1 },
    }),
    prisma.milestone.update({
      where: { id: adjacent.id },
      data: { order: milestone.order },
    }),
    prisma.milestone.update({
      where: { id: milestone.id },
      data: { order: adjacent.order },
    }),
  ]);

  revalidatePath(`/goals/${milestone.goalId}`);
}

export async function addProgressLog(goalId: string, formData: FormData) {
  const userId = await requireUserId();
  const value = getOptionalNumber(formData, "value");
  const note = getOptionalString(formData, "note");

  if (value === null || value < 0) {
    redirect(`/goals/${goalId}`);
  }

  const goal = await prisma.goal.findFirst({
    where: { id: goalId, userId },
    select: { id: true, targetValue: true },
  });

  if (!goal) {
    redirect("/goals");
  }

  const status =
    goal.targetValue && value >= goal.targetValue
      ? GoalStatus.COMPLETED
      : GoalStatus.IN_PROGRESS;

  await prisma.$transaction([
    prisma.progressLog.create({
      data: {
        goalId,
        value,
        note,
      },
    }),
    prisma.goal.update({
      where: { id: goalId },
      data: {
        currentValue: value,
        status,
      },
    }),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/goals");
  revalidatePath(`/goals/${goalId}`);
}
