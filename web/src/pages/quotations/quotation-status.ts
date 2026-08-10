import type { QuotationStatus } from "@artisancode/api-types";

export const quotationStatusLabel: Record<QuotationStatus, string> = {
  new: "Baru Masuk",
  in_review: "Dalam Tinjauan",
  responded: "Sudah Dikirim",
};

export const quotationStatusVariant: Record<
  QuotationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  new: "default",
  in_review: "secondary",
  responded: "outline",
};
