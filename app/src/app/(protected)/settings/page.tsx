import { Mail, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { CategoryManager } from "@/components/categories/category-manager";
import { AvatarImage } from "@/components/user/avatar-image";
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
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

import { updateProfile } from "./actions";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, categories] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        accounts: {
          select: { provider: true },
          orderBy: { provider: "asc" },
        },
      },
    }),
    prisma.category.findMany({
      where: { userId: session.user.id },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-primary">Settings</p>
          <h1 className="text-3xl font-semibold tracking-normal">Profile</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Manage the personal identity displayed across your goal workspace.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Signed-in profile and providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <AvatarImage
                src={user.image}
                name={user.name ?? user.email ?? "User"}
                className="size-16 text-lg"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {user.name ?? "Unnamed user"}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="size-4" aria-hidden="true" />
                {user.accounts.length
                  ? user.accounts.map((account) => account.provider).join(", ")
                  : "Credentials"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>
              Email is managed by your sign-in method. Name and avatar URL can be
              updated here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MutationForm
              action={updateProfile}
              className="grid gap-4"
              toastTitle="Profile update submitted"
              toastDescription="Your profile changes are being saved."
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user.name ?? ""}
                  placeholder="Your display name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email ?? ""} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Avatar URL</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={user.image ?? ""}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Button type="submit">Save changes</Button>
              </div>
            </MutationForm>
          </CardContent>
        </Card>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
