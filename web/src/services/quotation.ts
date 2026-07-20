import { mockQuotations } from "@/data/quotations";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateQuotationReq,
  QuotationList,
  QuotationRequest,
  QuotationStatus,
} from "@artisancode/api-types";

function mockList(): QuotationList {
  // ponytail: newest first
  const items = [...mockQuotations].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const quotationService = {
  list: () =>
    DEMO_MODE
      ? Promise.resolve(mockList())
      : api.get<QuotationList>("/quotations"),

  create: (body: CreateQuotationReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<QuotationRequest>("/quotations", body),

  updateStatus: (id: string, status: QuotationStatus) =>
    DEMO_MODE
      ? mockUpdateStatus(id, status)
      : api.put<QuotationRequest>(`/quotations/${id}`, { status }),
};

function mockCreate(body: CreateQuotationReq): Promise<QuotationRequest> {
  const now = new Date().toISOString();
  const q: QuotationRequest = {
    id: `q${crypto.randomUUID()}`,
    ...body,
    status: "new",
    createdAt: now,
  };
  mockQuotations.push(q);
  return Promise.resolve(q);
}

function mockUpdateStatus(
  id: string,
  status: QuotationStatus,
): Promise<QuotationRequest> {
  const idx = mockQuotations.findIndex((x) => x.id === id);
  const existing = mockQuotations[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Quotation not found"));
  const updated = { ...existing, status };
  mockQuotations[idx] = updated;
  return Promise.resolve(updated);
}
