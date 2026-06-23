import { api } from "@/lib/api";

import type {
  Customer,
  CustomerList,
  CreateCustomerReq,
  UpdateCustomerReq,
} from "@artisancode/api-types";

export interface CustomerQuery {
  q?: string;
  type?: string;
  status?: string;
  potential?: string;
  category_id?: string;
  segmentation_id?: string;
  area_id?: string;
  per_page?: number;
  page?: number;
}

export const customerService = {
  list: (params?: CustomerQuery) =>
    api.get<CustomerList>("/customers", params as Record<string, string>),

  get: (id: string) => api.get<Customer>(`/customers/${id}`),

  create: (body: CreateCustomerReq) =>
    api.post<Customer>("/customers", toSnakeBody(body)),

  update: (id: string, body: UpdateCustomerReq) =>
    api.put<Customer>(`/customers/${id}`, toSnakeBody(body)),

  delete: (id: string) => api.del(`/customers/${id}`),
};

function toSnakeBody(body: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
