import type { ProjectStatus } from "@artisancode/api-types";

export const projectStatusLabel: Record<ProjectStatus, string> = {
  prospect: "Prospek",
  in_progress: "Sedang Proses",
  won: "Berhasil",
  lost: "Gagal",
};

export const projectStatusVariant: Record<
  ProjectStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  prospect: "outline",
  in_progress: "secondary",
  won: "default",
  lost: "destructive",
};

export const formatRupiah = (n?: number) =>
  n ? `Rp ${n.toLocaleString("id-ID")}` : "-";
