import { mockBroadcastLogs, mockBroadcastTemplates } from "@/data/broadcasts";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  BroadcastList,
  BroadcastLog,
  BroadcastTemplate,
  CreateBroadcastTemplateReq,
} from "@artisancode/api-types";

function mockList(): BroadcastList {
  const items = [...mockBroadcastTemplates].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const broadcastService = {
  list: () =>
    DEMO_MODE
      ? Promise.resolve(mockList())
      : api.get<BroadcastList>("/broadcasts"),

  create: (body: CreateBroadcastTemplateReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<BroadcastTemplate>("/broadcasts", body),

  listLogs: () =>
    DEMO_MODE
      ? Promise.resolve(
          [...mockBroadcastLogs].sort((a, b) =>
            b.sentAt.localeCompare(a.sentAt),
          ),
        )
      : api.get<BroadcastLog[]>("/broadcasts/logs"),

  getLogsByTemplateId: (templateId: string) =>
    DEMO_MODE
      ? Promise.resolve(
          mockBroadcastLogs.filter((log) => log.templateId === templateId),
        )
      : api.get<BroadcastLog[]>(`/broadcasts/${templateId}/logs`),

  send: (templateId: string, recipientCount: number) =>
    DEMO_MODE
      ? mockSend(templateId, recipientCount)
      : api.post<BroadcastLog>("/broadcasts/send", {
          templateId,
          recipientCount,
        }),
};

function mockCreate(
  body: CreateBroadcastTemplateReq,
): Promise<BroadcastTemplate> {
  const t: BroadcastTemplate = {
    id: `b${crypto.randomUUID()}`,
    ...body,
    status: body.scheduledAt ? "scheduled" : "draft",
    createdAt: new Date().toISOString(),
  };
  mockBroadcastTemplates.push(t);
  return Promise.resolve(t);
}

function mockSend(
  templateId: string,
  recipientCount: number,
): Promise<BroadcastLog> {
  // ponytail: demo - generate recipient logs with mixed statuses
  const recipientLogs = [];
  for (let i = 0; i < recipientCount; i++) {
    const statuses: ("pending" | "sent" | "failed")[] = [
      "sent",
      "sent",
      "sent",
      "failed",
      "pending",
    ];
    const status = statuses[i % statuses.length] ?? "pending";
    recipientLogs.push({
      contactId: `c${i + 1}`,
      contactName: `Contact ${i + 1}`,
      status,
      ...(status === "sent" ? { sentAt: new Date().toISOString() } : {}),
      ...(status === "failed"
        ? { errorMessage: "WhatsApp number not connected" }
        : {}),
    });
  }

  const finalStatus = recipientLogs.some((l) => l.status === "failed")
    ? "failed"
    : "sent";

  const log: BroadcastLog = {
    id: `l${crypto.randomUUID()}`,
    templateId,
    sentAt: new Date().toISOString(),
    recipientCount,
    status: finalStatus,
    recipientLogs,
  };
  mockBroadcastLogs.push(log);

  // ponytail: lock the template once it has actually run, so it can't be edited afterwards.
  const template = mockBroadcastTemplates.find((t) => t.id === templateId);
  if (template) {
    template.status = finalStatus;
    template.sentAt = log.sentAt;
  }

  return Promise.resolve(log);
}

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
      gender?: "male" | "female";
      religion?: string;
    };
    customer: {
      id: string;
      name: string;
      segmentationId?: string;
      status?: string;
    };
  }[],
  filters: AudienceFilters,
): BroadcastAudience[] {
  let filtered = results;
  if (filters.gender)
    filtered = filtered.filter((r) => r.contact.gender === filters.gender);
  if (filters.religion)
    filtered = filtered.filter((r) => r.contact.religion === filters.religion);
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
