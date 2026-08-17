import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.email("Email tidak valid").min(1, "Email wajib diisi"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const profileInitial: ProfileValues = {
  name: "Admin",
  email: "admin@wika.co.id",
};

export const passwordSchema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirm: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Password tidak cocok",
    path: ["confirm"],
  });

export type PasswordValues = z.infer<typeof passwordSchema>;

export const passwordEmpty: PasswordValues = { password: "", confirm: "" };
