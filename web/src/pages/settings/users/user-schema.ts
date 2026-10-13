import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";
import { z } from "zod";

export function buildUserSchema(isEditing: boolean) {
  return z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    username: isEditing
      ? z.string().optional()
      : z.string().min(3, "Username minimal 3 karakter"),
    email: z.email("Email tidak valid"),
    phone: z.string().min(1, "Nomor telepon wajib diisi"),
    countryCode: z.string().min(1, "Kode negara wajib dipilih"),
    password: isEditing
      ? z.string().optional()
      : z.string().min(6, "Password minimal 6 karakter"),
    roleId: z.string().min(1, "Role wajib dipilih"),
    status: z.enum(["active", "inactive"]),
  });
}

export type UserFormValues = z.infer<ReturnType<typeof buildUserSchema>>;

export const defaultUserValues: UserFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  password: "",
  roleId: "",
  status: "active",
};
