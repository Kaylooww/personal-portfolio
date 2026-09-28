/** Uniform return shape for admin Server Actions (serialisable across the client boundary). */
export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function ok<T>(data: T, message?: string): ActionResult<T> {
  return { ok: true, data, message };
}

export function fail(error: string, fieldErrors?: Record<string, string>): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

/** Postgres unique-violation → friendly field error; everything else stays generic. */
export function fromDbError(error: { code?: string; message?: string } | null, uniqueField?: string): ActionResult<never> {
  if (error?.code === "23505" && uniqueField) {
    return fail("That value is already in use.", { [uniqueField]: "Already used by another entry — choose another." });
  }
  if (error?.code === "23514") return fail("Some values are outside what the database allows. Check the fields and try again.");
  if (error?.code === "42501") return fail("You don't have permission to do that.");
  console.error("[admin action] database error", error);
  return fail("Something went wrong while saving. Please try again.");
}
