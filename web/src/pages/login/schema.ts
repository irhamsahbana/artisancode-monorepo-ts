import { z } from "zod";

export const schema = z.object({
  email: z.email("Email tidak valid").min(1, "Email wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = { email: "", password: "" };
