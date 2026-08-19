import { api } from "@/lib/api";

import type {
  BroadcastList,
  BroadcastLog,
  BroadcastTemplate,
  CreateBroadcastTemplateReq,
} from "@artisancode/api-types";

export interface BroadcastListParams {
  page?: number;
  per_page?: number;
}

export const broadcastService = {
  list: (params?: BroadcastListParams) =>
    api.get<BroadcastList>(
      "/broadcasts",
      params as Record<string, string | number | boolean | undefined>,
    ),

  create: (body: CreateBroadcastTemplateReq) =>
    api.post<BroadcastTemplate>("/broadcasts", body),

  listLogs: () => api.get<BroadcastLog[]>("/broadcasts/logs"),

  getLogsByTemplateId: (templateId: string) =>
    api.get<BroadcastLog[]>(`/broadcasts/${templateId}/logs`),

  send: (templateId: string, recipientCount: number) =>
    api.post<BroadcastLog>("/broadcasts/send", {
      templateId,
      recipientCount,
    }),

  delete: (id: string) => api.del(`/broadcasts/${id}`),
};

// Helper: filter key persons (Contact) by their own + company attributes.
export interface BroadcastAudience {
  contactId: string;
  contactName: string;
  customerName: string;
  whatsapp: string | undefined;
}

export interface AudienceFilters {
  gender?: "male" | "female";
  religion?: string;
  segmentationId?: string;
  customerStatus?: string;
}

export function filterAudience(
  results: {
    contact: {
      id: string;
      name: string;
      whatsapp?: string;
    };
    customer: {
      id: string;
      name: string;
      gender?: "male" | "female" | null;
      religion?: string | null;
      segmentationId?: string;
      status?: string;
    };
  }[],
  filters: AudienceFilters,
): BroadcastAudience[] {
  let filtered = results;
  // Personal fields (gender/religion) live on the customer record, not the
  // contact — matches how the backend's send() usecase resolves audience.
  if (filters.gender)
    filtered = filtered.filter((r) => r.customer.gender === filters.gender);
  if (filters.religion)
    filtered = filtered.filter((r) => r.customer.religion === filters.religion);
  if (filters.segmentationId)
    filtered = filtered.filter(
      (r) => r.customer.segmentationId === filters.segmentationId,
    );
  if (filters.customerStatus)
    filtered = filtered.filter(
      (r) => r.customer.status === filters.customerStatus,
    );
  return filtered.map((r) => ({
    contactId: r.contact.id,
    contactName: r.contact.name,
    customerName: r.customer.name,
    whatsapp: r.contact.whatsapp,
  }));
}
