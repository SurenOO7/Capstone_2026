import { GoalPriority } from "@/generated/prisma/client";

export const goalTemplates = [
  {
    id: "read-12-books",
    name: "Read 12 books",
    description: "A yearly reading plan with measurable book count progress.",
    title: "Read 12 books",
    goalDescription: "Read one meaningful book each month and keep notes.",
    targetValue: 12,
    unit: "books",
    priority: GoalPriority.MEDIUM,
    milestones: [
      "Choose the first 3 books",
      "Finish book 3",
      "Finish book 6",
      "Finish book 9",
      "Finish book 12",
    ],
  },
  {
    id: "exercise-3x-week",
    name: "Exercise 3x/week",
    description: "A consistency template for weekly health routines.",
    title: "Exercise 3 times per week",
    goalDescription: "Build a sustainable routine with three focused sessions weekly.",
    targetValue: 36,
    unit: "sessions",
    priority: GoalPriority.HIGH,
    milestones: [
      "Plan the weekly workout schedule",
      "Complete first 6 sessions",
      "Complete 18 sessions",
      "Complete 36 sessions",
    ],
  },
  {
    id: "learn-language",
    name: "Learn a language",
    description: "A study plan for vocabulary, speaking practice, and review.",
    title: "Learn a new language",
    goalDescription: "Practice vocabulary, listening, and speaking with weekly reviews.",
    targetValue: 60,
    unit: "hours",
    priority: GoalPriority.HIGH,
    milestones: [
      "Select learning resources",
      "Complete 10 study hours",
      "Hold first speaking practice",
      "Complete 30 study hours",
      "Complete 60 study hours",
    ],
  },
] as const;

export type GoalTemplateId = (typeof goalTemplates)[number]["id"];

export function getGoalTemplate(templateId?: string) {
  return goalTemplates.find((template) => template.id === templateId);
}
