"use server";

import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/auth/admin";
import { safeAdminPath } from "@/lib/auth/paths";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";

export interface SignInState {
  error: string | null;
  /** Echoed back so the email field keeps its value after a failed attempt. */
  email: string;
}

// Deliberately vague: never reveal whether the email or the password was wrong.
const GENERIC_ERROR = "Email or password is incorrect.";

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    next: String(formData.get("next") ?? "") || undefined,
  };

  if (!isSupabaseConfigured()) {
    return { error: "Sign-in is unavailable: Supabase is not configured.", email: raw.email };
  }

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? GENERIC_ERROR, email: raw.email };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error?.code === "email_provider_disabled") {
    // A project setting, not a credential problem — say so, it reveals nothing about the account.
    return {
      error: "Email sign-in is turned off for this Supabase project (Authentication → Sign In / Providers → Email).",
      email: parsed.data.email,
    };
  }
  if (error || !data.user) {
    return { error: GENERIC_ERROR, email: parsed.data.email };
  }

  // A valid account that isn't the admin gets no session at all.
  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { error: GENERIC_ERROR, email: parsed.data.email };
  }

  redirect(safeAdminPath(parsed.data.next));
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login?signedOut=1");
}
