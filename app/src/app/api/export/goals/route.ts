import { NextResponse } from "next/server";

import { GoalStatus } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { formatPriority, formatStatus, getProgressPercent } from "@/lib/goal-utils";

function csvCell(value: string | number | null | undefined) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const goals = await prisma.goal.findMany({
    where: { userId: session.user.id },
    include: {
      category: true,
      milestones: { select: { completed: true } },
      progressLogs: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    [
      "Title",
      "Description",
      "Category",
      "Priority",
      "Status",
      "Deadline",
      "Progress percent",
      "Current value",
      "Target value",
      "Unit",
      "Milestones completed",
      "Milestones total",
      "Progress logs",
      "Created at",
      "Updated at",
    ],
    ...goals.map((goal) => [
      goal.title,
      goal.description,
      goal.category?.name,
      formatPriority(goal.priority),
      formatStatus(goal.status),
      goal.deadline?.toISOString().slice(0, 10),
      goal.status === GoalStatus.COMPLETED ? 100 : getProgressPercent(goal),
      goal.currentValue,
      goal.targetValue,
      goal.unit,
      goal.milestones.filter((milestone) => milestone.completed).length,
      goal.milestones.length,
      goal.progressLogs.length,
      goal.createdAt.toISOString(),
      goal.updatedAt.toISOString(),
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="goaltrack-goals.csv"',
    },
  });
}
