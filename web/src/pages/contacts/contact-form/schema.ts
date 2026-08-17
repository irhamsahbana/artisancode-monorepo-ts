import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  position: z.string().optional(),
  whatsapp: z.string().optional(),
  countryCode: z.string().min(1, "Kode negara wajib dipilih"),
  email: z.email("Email tidak valid").optional().or(z.literal("")),
  gender: z.enum(["male", "female"]).optional().or(z.literal("")),
  birthPlace: z.string().optional(),
  dateOfBirth: z.string().optional(),
  religion: z.string().optional(),
  education: z.string().optional(),
  address: z.string().optional(),
  spouseName: z.string().optional(),
  spouseOccupation: z.string().optional(),
  childrenNames: z.string().optional(),
  childrenOccupation: z.string().optional(),
  profiling: z.string().optional(),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  name: "",
  position: "",
  whatsapp: "",
  countryCode: DEFAULT_COUNTRY_CODE,
  email: "",
  gender: "",
  birthPlace: "",
  dateOfBirth: "",
  religion: "",
  education: "",
  address: "",
  spouseName: "",
  spouseOccupation: "",
  childrenNames: "",
  childrenOccupation: "",
  profiling: "",
  notes: "",
};
