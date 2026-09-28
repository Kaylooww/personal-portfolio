import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "Enter a valid email address." })).pipe(z.string().max(254)),
  password: z.string().min(1, { error: "Enter your password." }).max(200),
  next: z.string().max(500).optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
