import type { RiskLevel } from "@artisancode/api-types";

export const riskLabel: Record<RiskLevel, string> = {
  low: "Rendah",
  medium: "Sedang",
  high: "Tinggi",
};

export const riskVariant: Record<
  RiskLevel,
  "default" | "secondary" | "destructive" | "outline"
> = {
  low: "default",
  medium: "secondary",
  high: "destructive",
};
