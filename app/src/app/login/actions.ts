"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { getOAuthProviderAvailability } from "@/lib/oauth-providers";
import { hashPassword } from "@/lib/password";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginWithProvider(formData: FormData) {
  const provider = getString(formData, "provider");
  const availability = getOAuthProviderAvailability();

  if (provider !== "google" || !availability.google) {
    redirect("/login?error=UnknownProvider");
  }

  await signIn(provider, { redirectTo: "/dashboard" });
}

export async function loginWithCredentials(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?mode=login&error=CredentialsSignin");
    }

    throw error;
  }
}

export async function registerWithCredentials(formData: FormData) {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!name || !email || password.length < 8 || password !== confirmPassword) {
    redirect("/login?mode=register&error=InvalidRegistration");
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    redirect("/login?mode=register&error=EmailExists");
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
    },
  });

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/login?mode=login&registered=1");
    }

    throw error;
  }
}
