import type { BroadcastOccasion } from "@artisancode/api-types";

export const occasionLabel: Record<BroadcastOccasion, string> = {
  idul_fitri: "Idul Fitri",
  idul_adha: "Idul Adha",
  christmas: "Natal",
  new_year: "Tahun Baru",
  national_day: "Hari Nasional",
  company_anniversary: "Hari Ulang Tahun Perusahaan",
  thank_you: "Terima Kasih",
  custom: "Custom",
};

export const statusLabel: Record<
  "draft" | "scheduled" | "sent" | "failed",
  string
> = {
  draft: "Draft",
  scheduled: "Terjadwal",
  sent: "Terkirim",
  failed: "Gagal",
};
