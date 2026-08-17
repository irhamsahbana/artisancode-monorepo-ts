import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  segmentationId: z.string().min(1, "Segmentasi wajib dipilih"),
  areaId: z.string().min(1, "Area wajib dipilih"),
  companyType: z
    .enum(["bumn", "swasta_nasional", "swasta_asing"])
    .optional()
    .or(z.literal("")),
  status: z.enum(["prospect", "active", "inactive"]),
  potential: z.enum(["high", "medium", "low"]),
  address: z.string().optional(),
  npwp: z.string().optional(),
  skt: z.string().optional(),
  companyEmail: z.email("Email tidak valid").optional().or(z.literal("")),
  website: z.string().optional(),
  notes: z.string().optional(),
});

export type FormValues = z.infer<typeof schema>;

export const emptyValues: FormValues = {
  name: "",
  segmentationId: "",
  areaId: "",
  companyType: "",
  status: "prospect",
  potential: "medium",
  address: "",
  npwp: "",
  skt: "",
  companyEmail: "",
  website: "",
  notes: "",
};
