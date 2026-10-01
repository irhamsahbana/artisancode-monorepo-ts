import { DEFAULT_COUNTRY_CODE } from "@artisancode/phone";
import { z } from "zod";

export const whatsappLoginSchema = z.object({
  countryCode: z.string().min(1, "Kode negara wajib diisi"),
  phone: z.string().min(1, "No. HP wajib diisi"),
});

export type WhatsappLoginValues = z.infer<typeof whatsappLoginSchema>;

export const whatsappLoginDefaultValues: WhatsappLoginValues = {
  countryCode: DEFAULT_COUNTRY_CODE,
  phone: "",
};
