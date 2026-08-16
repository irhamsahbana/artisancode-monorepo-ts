import { mockUnitsOfMeasurement } from "@/data/uoms";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateUnitOfMeasurementReq,
  UnitOfMeasurement,
  UnitOfMeasurementList,
  UpdateUnitOfMeasurementReq,
} from "@artisancode/api-types";

export interface UomListParams {
  page?: number;
  per_page?: number;
  q?: string;
  category?: string;
  is_active?: boolean;
}

function mockList(params?: UomListParams): UnitOfMeasurementList {
  const { q, category, page = 1, per_page = 100 } = params ?? {};
  let items = mockUnitsOfMeasurement;
  if (q) {
    const query = q.toLowerCase();
    items = items.filter((u) => u.name.toLowerCase().includes(query));
  }
  if (category) items = items.filter((u) => u.category === category);
  const start = (page - 1) * per_page;
  return {
    items: items.slice(start, start + per_page),
    pagination: {
      total: items.length,
      page,
      per_page,
      last_page: Math.max(1, Math.ceil(items.length / per_page)),
    },
  };
}

export const uomService = {
  list: (params?: UomListParams) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<UnitOfMeasurementList>(
          "/uoms",
          params as Record<string, string | number | boolean | undefined>,
        ),

  create: (body: CreateUnitOfMeasurementReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<UnitOfMeasurement>("/uoms", body),

  update: (id: string, body: UpdateUnitOfMeasurementReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<UnitOfMeasurement>(`/uoms/${id}`, body),
};

function mockCreate(
  body: CreateUnitOfMeasurementReq,
): Promise<UnitOfMeasurement> {
  const now = new Date().toISOString();
  const u: UnitOfMeasurement = {
    id: `uom${crypto.randomUUID()}`,
    name: body.name,
    symbol: body.symbol,
    category: body.category,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };
  mockUnitsOfMeasurement.push(u);
  return Promise.resolve(u);
}

function mockUpdate(
  id: string,
  body: UpdateUnitOfMeasurementReq,
): Promise<UnitOfMeasurement> {
  const idx = mockUnitsOfMeasurement.findIndex((x) => x.id === id);
  const existing = mockUnitsOfMeasurement[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Unit of measurement not found"));
  const updated: UnitOfMeasurement = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockUnitsOfMeasurement[idx] = updated;
  return Promise.resolve(updated);
}
