export const TABS = ["Info Umum", "Kontak", "Riwayat Kontrak"] as const;
export type Tab = (typeof TABS)[number];

export const statusLabel: Record<string, string> = {
  active: "Aktif",
  prospect: "Prospek",
  inactive: "Tidak Aktif",
};

export const statusVariant: Record<
  string,
  "default" | "secondary" | "outline"
> = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
};

export const potentialLabel: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export const companyTypeLabel: Record<string, string> = {
  bumn: "BUMN",
  swasta_nasional: "Swasta Nasional",
  swasta_asing: "Swasta Asing",
};
