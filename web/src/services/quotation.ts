import { api } from "@/lib/api";

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

export const quotationService = {
  list: (params?: QuotationListParams) =>
    api.get<QuotationList>(
      "/quotations",
      params as Record<string, string | number | boolean | undefined>,
    ),

  create: (body: CreateQuotationReq) =>
    api.post<QuotationRequest>("/quotations", body),

  updateStatus: (id: string, status: QuotationStatus) =>
    api.put<QuotationRequest>(`/quotations/${id}/status`, { status }),

  assign: (id: string, body: AssignQuotationReq) =>
    api.put<QuotationRequest>(`/quotations/${id}/assign`, body),
};
