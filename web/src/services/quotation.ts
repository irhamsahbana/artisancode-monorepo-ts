import { mockQuotations } from "@/data/quotations";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateQuotationReq,
  AssignQuotationReq,
  QuotationList,
  QuotationRequest,
  QuotationStatus,
} from "@artisancode/api-types";

export interface QuotationListParams {
  page?: number;
  per_page?: number;
  q?: string;
  status?: QuotationStatus;
}

function mockList(params?: QuotationListParams): QuotationList {
  const { q, status, page = 1, per_page = 100 } = params ?? {};
  // ponytail: newest first
  let items = [...mockQuotations].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  if (q) {
    const query = q.toLowerCase();
    items = items.filter(
      (r) =>
        r.requesterName.toLowerCase().includes(query) ||
        (r.companyName ?? "").toLowerCase().includes(query) ||
        (r.title ?? "").toLowerCase().includes(query),
    );
  }
  if (status) items = items.filter((r) => r.status === status);
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

export const quotationService = {
  list: (params?: QuotationListParams) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<QuotationList>(
          "/quotations",
          params as Record<string, string | number | boolean | undefined>,
        ),

  create: (body: CreateQuotationReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<QuotationRequest>("/quotations", body),

  updateStatus: (id: string, status: QuotationStatus) =>
    DEMO_MODE
      ? mockUpdateStatus(id, status)
      : api.put<QuotationRequest>(`/quotations/${id}/status`, { status }),

  assign: (id: string, body: AssignQuotationReq) =>
    DEMO_MODE
      ? mockAssign(id, body)
      : api.put<QuotationRequest>(`/quotations/${id}/assign`, body),
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

function mockAssign(
  id: string,
  body: AssignQuotationReq,
): Promise<QuotationRequest> {
  const idx = mockQuotations.findIndex((x) => x.id === id);
  const existing = mockQuotations[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Quotation not found"));
  const updated = { ...existing, ...body };
  mockQuotations[idx] = updated;
  return Promise.resolve(updated);
}
