import type { Category, Goal } from "@/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MutationForm } from "@/components/ui/mutation-form";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { priorityOptions, statusOptions } from "@/lib/goal-utils";

function dateInputValue(date?: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export function GoalForm({
  title,
  description,
  action,
  categories,
  goal,
  submitLabel,
  showStatus = false,
  error,
}: Readonly<{
  title: string;
  description: string;
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  goal?: Goal;
  submitLabel: string;
  showStatus?: boolean;
  error?: string;
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="mb-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        ) : null}
        <MutationForm
          action={action}
          className="grid gap-5"
          toastTitle={goal ? "Goal update submitted" : "Goal creation submitted"}
          toastDescription="Your changes are being saved."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={goal?.title ?? ""}
                placeholder="Run a half marathon"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={goal?.description ?? ""}
                placeholder="Define the outcome, motivation, and constraints."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" name="categoryId" defaultValue={goal?.categoryId ?? ""}>
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon ? `${category.icon} ` : ""}
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                name="priority"
                defaultValue={goal?.priority ?? "MEDIUM"}
              >
                {priorityOptions.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Select>
            </div>
            {showStatus ? (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  defaultValue={goal?.status ?? "NOT_STARTED"}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                defaultValue={dateInputValue(goal?.deadline)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetValue">Target value</Label>
              <Input
                id="targetValue"
                name="targetValue"
                type="number"
                step="0.01"
                min="0"
                defaultValue={goal?.targetValue ?? ""}
                placeholder="100"
              />
            </div>
            {goal ? (
              <div className="space-y-2">
                <Label htmlFor="currentValue">Current value</Label>
                <Input
                  id="currentValue"
                  name="currentValue"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={goal.currentValue}
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                name="unit"
                defaultValue={goal?.unit ?? ""}
                placeholder="km, pages, hours"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="submit">{submitLabel}</Button>
          </div>
        </MutationForm>
      </CardContent>
    </Card>
  );
}
