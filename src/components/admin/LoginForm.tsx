"use client";

import { useActionState } from "react";
import { TextField } from "@/components/forms/TextField";
import { buttonClasses } from "@/components/ui/ButtonLink";
import { signIn, type SignInState } from "@/lib/actions/auth";

const INITIAL: SignInState = { error: null, email: "" };

/** Email + password form posting to the signIn Server Action (works without JS). */
export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, INITIAL);

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="username"
        inputMode="email"
        required
        defaultValue={state.email}
        autoFocus
      />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required />

      <p role="alert" aria-live="assertive" className="min-h-5 text-sm font-bold text-danger-600">
        {state.error}
      </p>

      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full disabled:opacity-70")}>
        {pending ? "Checking credentials…" : "Sign in"}
      </button>
    </form>
  );
}
