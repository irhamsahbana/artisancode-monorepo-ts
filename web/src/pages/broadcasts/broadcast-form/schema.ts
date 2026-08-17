import { z } from "zod";

export const schema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi"),
    message: z.string().min(1, "Pesan wajib diisi"),
    occasion: z.enum([
      "idul_fitri",
      "idul_adha",
      "christmas",
      "new_year",
      "national_day",
      "company_anniversary",
      "thank_you",
      "custom",
    ]),
    gender: z.string().optional(),
    religion: z.string().optional(),
    segmentationId: z.string().optional(),
    customerStatus: z.string().optional(),
    scheduleType: z.enum(["now", "later"]),
    scheduledAt: z.string().optional(),
  })
  .refine((data) => data.scheduleType !== "later" || !!data.scheduledAt, {
    message: "Jadwal wajib diisi",
    path: ["scheduledAt"],
  });

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  name: "",
  message: "",
  occasion: "thank_you",
  gender: "",
  religion: "",
  segmentationId: "",
  customerStatus: "",
  scheduleType: "now",
  scheduledAt: "",
};
