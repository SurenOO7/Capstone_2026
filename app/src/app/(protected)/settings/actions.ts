"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

export async function updateProfile(formData: FormData) {
  const userId = await requireUserId();
  const name = getString(formData, "name");
  const image = getString(formData, "image");

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || null,
      image: image || null,
    },
  });

  revalidatePath("/settings");
}

export async function createCategory(formData: FormData) {
  const userId = await requireUserId();
  const name = getString(formData, "name");
  const color = getString(formData, "color") || "#2563eb";
  const icon = getString(formData, "icon");

  if (!name) {
    return;
  }

  await prisma.category.create({
    data: {
      userId,
      name,
      color,
      icon: icon || null,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/goals");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const userId = await requireUserId();
  const name = getString(formData, "name");
  const color = getString(formData, "color") || "#2563eb";
  const icon = getString(formData, "icon");

  if (!name) {
    return;
  }

  await prisma.category.update({
    where: {
      id: categoryId,
      userId,
    },
    data: {
      name,
      color,
      icon: icon || null,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/goals");
}

export async function deleteCategory(categoryId: string) {
  const userId = await requireUserId();

  await prisma.category.delete({
    where: {
      id: categoryId,
      userId,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/goals");
}
