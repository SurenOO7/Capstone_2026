import { Plus, Tags, Trash2 } from "lucide-react";

import type { Category } from "@/generated/prisma/client";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/(protected)/settings/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MutationForm } from "@/components/ui/mutation-form";

export function CategoryManager({
  categories,
}: Readonly<{
  categories: Category[];
}>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          Create color-coded groups used by goal filters and cards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <MutationForm
          action={createCategory}
          className="grid gap-3 rounded-lg border border-border bg-background p-4 md:grid-cols-[1fr_120px_160px_auto]"
          toastTitle="Category creation submitted"
          toastDescription="The category list will refresh after saving."
        >
          <div className="space-y-2">
            <Label htmlFor="categoryName">Name</Label>
            <Input
              id="categoryName"
              name="name"
              placeholder="Health"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryColor">Color</Label>
            <Input
              id="categoryColor"
              name="color"
              type="color"
              defaultValue="#2563eb"
              className="h-10 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryIcon">Icon label</Label>
            <Input id="categoryIcon" name="icon" placeholder="target" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              <Plus aria-hidden="true" />
              Add
            </Button>
          </div>
        </MutationForm>

        {categories.length ? (
          <div className="divide-y divide-border rounded-lg border border-border">
            {categories.map((category) => (
              <div
                key={category.id}
                className="grid gap-3 p-4 md:grid-cols-[1fr_120px_160px_auto_auto]"
              >
                <MutationForm
                  action={updateCategory.bind(null, category.id)}
                  className="contents"
                  toastTitle="Category update submitted"
                  toastDescription="The category details are being saved."
                >
                  <div className="space-y-2">
                    <Label htmlFor={`name-${category.id}`}>Name</Label>
                    <Input
                      id={`name-${category.id}`}
                      name="name"
                      defaultValue={category.name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`color-${category.id}`}>Color</Label>
                    <Input
                      id={`color-${category.id}`}
                      name="color"
                      type="color"
                      defaultValue={category.color}
                      className="h-10 p-1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`icon-${category.id}`}>Icon label</Label>
                    <Input
                      id={`icon-${category.id}`}
                      name="icon"
                      defaultValue={category.icon ?? ""}
                      placeholder="target"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" variant="secondary" className="w-full">
                      Save
                    </Button>
                  </div>
                </MutationForm>
                <div className="flex items-end">
                  <ConfirmDialog
                    title="Delete category"
                    description={`Goals in "${category.name}" will keep existing content and lose this category label.`}
                    confirmLabel="Delete category"
                    destructive
                    trigger={
                      <Button type="button" variant="outline" className="w-full">
                        <Trash2 aria-hidden="true" />
                        Delete
                      </Button>
                    }
                  >
                    <MutationForm
                      action={deleteCategory.bind(null, category.id)}
                      toastTitle="Category deletion submitted"
                      toastDescription="The category is being removed."
                    >
                      <Button type="submit" variant="destructive">
                        Delete category
                      </Button>
                    </MutationForm>
                  </ConfirmDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <span className="mx-auto flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Tags className="size-4" aria-hidden="true" />
            </span>
            <h3 className="mt-3 font-medium tracking-normal">No categories yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add categories to organize goals by life area or project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
