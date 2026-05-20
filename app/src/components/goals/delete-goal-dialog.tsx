import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { MutationForm } from "@/components/ui/mutation-form";
import { deleteGoal } from "@/app/(protected)/goals/actions";

export function DeleteGoalDialog({
  goalId,
  title,
  size = "default",
}: Readonly<{
  goalId: string;
  title: string;
  size?: "default" | "sm";
}>) {
  const action = deleteGoal.bind(null, goalId);

  return (
    <ConfirmDialog
      title="Delete goal"
      description={`Delete "${title}" and all milestones and progress logs connected to it.`}
      confirmLabel="Delete goal"
      destructive
      trigger={
        <Button type="button" variant="outline" size={size}>
          <Trash2 aria-hidden="true" />
          Delete
        </Button>
      }
    >
      <MutationForm
        action={action}
        toastTitle="Goal deletion submitted"
        toastDescription="The goal and its history are being removed."
      >
        <Button type="submit" variant="destructive">
          Delete goal
        </Button>
      </MutationForm>
    </ConfirmDialog>
  );
}
