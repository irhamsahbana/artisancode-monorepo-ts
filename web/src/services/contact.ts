import { mockContacts } from "@/data/contacts";
import { mockCustomers } from "@/data/customers";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  Contact,
  ContactSearchResult,
  CreateContactReq,
  UpdateContactReq,
} from "@artisancode/api-types";

// ponytail: local list type kept as-is (camelCase pagination) so the existing
// contact UI is untouched. api-types ContactList lands in Fase 1.
export interface ContactList {
  items: Contact[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

function mockList(customerId: string): ContactList {
  const items = mockContacts.filter((c) => c.customerId === customerId);
  return {
    items,
    pagination: { total: items.length, page: 1, perPage: 100, lastPage: 1 },
  };
}

// ponytail: aggregate every contact whose name matches, joined to its company.
// Same person at N companies → N rows; the UI groups them by name.
// ponytail: search by contact name, position, OR company name
function mockSearch(q: string): ContactSearchResult[] {
  const query = q.trim().toLowerCase();
  const matched = mockContacts.filter((c) => {
    if (!query) return true;
    if (c.name.toLowerCase().includes(query)) return true;
    if ((c.position ?? "").toLowerCase().includes(query)) return true;
    const customer = mockCustomers.find((x) => x.id === c.customerId);
    if (customer && customer.name.toLowerCase().includes(query)) return true;
    return false;
  });
  const results: ContactSearchResult[] = [];
  for (const contact of matched) {
    const customer = mockCustomers.find((x) => x.id === contact.customerId);
    if (customer) results.push({ contact, customer });
  }
  return results;
}

export const contactService = {
  list: (customerId: string) =>
    DEMO_MODE
      ? Promise.resolve(mockList(customerId))
      : api.get<ContactList>("/contacts", {
          customer_id: customerId,
          per_page: 100,
        }),

  create: (body: CreateContactReq) =>
    DEMO_MODE
      ? mockCreate(body)
      : api.post<Contact>("/contacts", toSnakeBody(body)),

  update: (id: string, body: UpdateContactReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<Contact>(`/contacts/${id}`, toSnakeBody(body)),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/contacts/${id}`),

  search: (q: string) =>
    DEMO_MODE
      ? Promise.resolve(mockSearch(q))
      : api.get<ContactSearchResult[]>("/contacts/search", { q }),
};

function mockCreate(body: CreateContactReq): Promise<Contact> {
  const now = new Date().toISOString();
  const c: Contact = {
    id: `con${crypto.randomUUID()}`,
    customerId: body.customerId,
    name: body.name,
    position: body.position,
    whatsapp: body.whatsapp,
    email: body.email,
    notes: body.notes,
    isPrimary: body.isPrimary ?? false,
    createdAt: now,
    updatedAt: now,
  };
  mockContacts.push(c);
  return Promise.resolve(c);
}

function mockUpdate(id: string, body: UpdateContactReq): Promise<Contact> {
  const idx = mockContacts.findIndex((x) => x.id === id);
  const existing = mockContacts[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Contact not found"));
  const updated: Contact = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockContacts[idx] = updated;
  return Promise.resolve(updated);
}

function mockDelete(id: string): Promise<void> {
  const idx = mockContacts.findIndex((x) => x.id === id);
  if (idx !== -1) mockContacts.splice(idx, 1);
  return Promise.resolve();
}

function toSnakeBody(body: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
