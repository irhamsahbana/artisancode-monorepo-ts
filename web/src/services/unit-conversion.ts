import { mockUnitConversions } from "@/data/unit-conversions";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateUnitConversionReq,
  UnitConversion,
  UnitConversionList,
  UpdateUnitConversionReq,
} from "@artisancode/api-types";

function mockList(): UnitConversionList {
  const items = mockUnitConversions;
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const unitConversionService = {
  list: () =>
    DEMO_MODE
      ? Promise.resolve(mockList())
      : api.get<UnitConversionList>("/unit-conversions", { per_page: 100 }),

  create: (body: CreateUnitConversionReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<UnitConversion>("/unit-conversions", body),

  update: (id: string, body: UpdateUnitConversionReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<UnitConversion>(`/unit-conversions/${id}`, body),
};

function mockCreate(body: CreateUnitConversionReq): Promise<UnitConversion> {
  const now = new Date().toISOString();
  const c: UnitConversion = {
    id: `uc${crypto.randomUUID()}`,
    fromUnitId: body.fromUnitId,
    toUnitId: body.toUnitId,
    factor: body.factor,
    createdAt: now,
    updatedAt: now,
  };
  mockUnitConversions.push(c);
  return Promise.resolve(c);
}

function mockUpdate(
  id: string,
  body: UpdateUnitConversionReq,
): Promise<UnitConversion> {
  const idx = mockUnitConversions.findIndex((x) => x.id === id);
  const existing = mockUnitConversions[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Unit conversion not found"));
  const updated: UnitConversion = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockUnitConversions[idx] = updated;
  return Promise.resolve(updated);
}

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
