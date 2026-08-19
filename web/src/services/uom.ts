import { api } from "@/lib/api";

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

export const uomService = {
  list: (params?: UomListParams) =>
    api.get<UnitOfMeasurementList>(
      "/uoms",
      params as Record<string, string | number | boolean | undefined>,
    ),

  create: (body: CreateUnitOfMeasurementReq) =>
    api.post<UnitOfMeasurement>("/uoms", body),

  update: (id: string, body: UpdateUnitOfMeasurementReq) =>
    api.put<UnitOfMeasurement>(`/uoms/${id}`, body),
};
