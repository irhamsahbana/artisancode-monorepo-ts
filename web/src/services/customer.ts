import { mockCustomers } from "@/data/customers";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  Customer,
  CustomerList,
  CreateCustomerReq,
  UpdateCustomerReq,
} from "@artisancode/api-types";

export interface CustomerQuery {
  q?: string;
  status?: string;
  potential?: string;
  segmentation_id?: string;
  area_id?: string;
  per_page?: number;
  page?: number;
}

// ponytail: mock filter+paginate against the in-memory list. Returns the
// api-types CustomerList shape (snake_case pagination) so pages see no change.
function mockList(params?: CustomerQuery): CustomerList {
  let items = mockCustomers;
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter((c) => c.name.toLowerCase().includes(q));
  }
  if (params?.status) items = items.filter((c) => c.status === params.status);
  if (params?.potential)
    items = items.filter((c) => c.potential === params.potential);
  if (params?.segmentation_id)
    items = items.filter((c) => c.segmentationId === params.segmentation_id);
  if (params?.area_id) items = items.filter((c) => c.areaId === params.area_id);

  const page = params?.page ?? 1;
  const perPage = params?.per_page ?? 100;
  const start = (page - 1) * perPage;
  const sliced = items.slice(start, start + perPage);
  return {
    items: sliced,
    pagination: {
      total: items.length,
      page,
      per_page: perPage,
      last_page: Math.max(1, Math.ceil(items.length / perPage)),
    },
  };
}

export const customerService = {
  list: (params?: CustomerQuery) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<CustomerList>("/customers", params as Record<string, string>),

  get: (id: string) =>
    DEMO_MODE ? mockGet(id) : api.get<Customer>(`/customers/${id}`),

  create: (body: CreateCustomerReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<Customer>("/customers", toSnakeBody(body)),

  update: (id: string, body: UpdateCustomerReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<Customer>(`/customers/${id}`, toSnakeBody(body)),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/customers/${id}`),
};

function mockGet(id: string): Promise<Customer> {
  const c = mockCustomers.find((x) => x.id === id);
  return c
    ? Promise.resolve(c)
    : Promise.reject(new Error("Customer not found"));
}

function mockCreate(body: CreateCustomerReq): Promise<Customer> {
  const now = new Date().toISOString();
  const c = {
    ...body,
    status: body.status ?? "prospect",
    potential: body.potential ?? "medium",
    hasContractHistory: body.hasContractHistory ?? false,
    id: `c${crypto.randomUUID()}`,
    createdAt: now,
    updatedAt: now,
  } as Customer;
  mockCustomers.push(c);
  return Promise.resolve(c);
}

function mockUpdate(id: string, body: UpdateCustomerReq): Promise<Customer> {
  const idx = mockCustomers.findIndex((x) => x.id === id);
  const existing = mockCustomers[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Customer not found"));
  const updated: Customer = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockCustomers[idx] = updated;
  return Promise.resolve(updated);
}

function mockDelete(id: string): Promise<void> {
  const idx = mockCustomers.findIndex((x) => x.id === id);
  if (idx !== -1) mockCustomers.splice(idx, 1);
  return Promise.resolve();
}

function toSnakeBody(body: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
