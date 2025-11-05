"use server"; // This must be at the very top of the file

import { signIn } from "@/auth";

export async function handleSignIn(provider: string) {
  await signIn(provider,{ redirectTo: "/" });
}