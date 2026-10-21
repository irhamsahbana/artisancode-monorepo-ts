import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";
import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  segmentationId: z.string().min(1, "Segmentasi wajib dipilih"),
  areaId: z.string().min(1, "Area wajib dipilih"),
  companyType: z
    .enum(["bumn", "swasta_nasional", "swasta_asing", "perorangan"])
    .optional()
    .or(z.literal("")),
  status: z.enum(["prospect", "active", "inactive"]),
  potential: z.enum(["high", "medium", "low"]),
  address: z.string().optional(),
  npwp: z.string().optional(),
  skt: z.string().optional(),
  companyEmail: z.email("Email tidak valid").optional().or(z.literal("")),
  phone: z.string().optional(),
  phoneCountryCode: z.string().min(1, "Kode negara wajib dipilih"),
  fax: z.string().optional(),
  faxCountryCode: z.string().min(1, "Kode negara wajib dipilih"),
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
  phone: "",
  phoneCountryCode: DEFAULT_COUNTRY_CODE,
  fax: "",
  faxCountryCode: DEFAULT_COUNTRY_CODE,
  website: "",
  notes: "",
};
