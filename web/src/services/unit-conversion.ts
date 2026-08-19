import { api } from "@/lib/api";

import type {
  CreateUnitConversionReq,
  UnitConversion,
  UnitConversionList,
  UpdateUnitConversionReq,
} from "@artisancode/api-types";

export interface UnitConversionListParams {
  page?: number;
  per_page?: number;
}

export const unitConversionService = {
  list: (params?: UnitConversionListParams) =>
    api.get<UnitConversionList>(
      "/unit-conversions",
      params as Record<string, string | number | boolean | undefined>,
    ),

  create: (body: CreateUnitConversionReq) =>
    api.post<UnitConversion>("/unit-conversions", body),

  update: (id: string, body: UpdateUnitConversionReq) =>
    api.put<UnitConversion>(`/unit-conversions/${id}`, body),
};

// ponytail: only resolves a direct from->to pair or its single reverse step.
// Multi-hop chains (e.g. Sak -> Kilogram -> Gram in one call) aren't supported
// here; if that's ever needed, upgrade this to walk a graph of conversions
// (BFS/DFS over fromUnitId/toUnitId edges) instead of a single lookup.
export function convertQuantity(
  quantity: number,
  fromUnitId: string,
  toUnitId: string,
  conversions: UnitConversion[],
): number | null {
  if (fromUnitId === toUnitId) return quantity;

  const direct = conversions.find(
    (c) => c.fromUnitId === fromUnitId && c.toUnitId === toUnitId,
  );
  if (direct) return quantity * direct.factor;

  const reverse = conversions.find(
    (c) => c.fromUnitId === toUnitId && c.toUnitId === fromUnitId,
  );
  if (reverse) return quantity / reverse.factor;

  return null;
}
