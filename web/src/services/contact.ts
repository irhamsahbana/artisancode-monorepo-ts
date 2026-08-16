import { mockContacts } from "@/data/contacts";
import { mockCustomers } from "@/data/customers";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  Contact,
  ContactPersonGroup,
  ContactPersonGroupList,
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

function mockGet(id: string): Promise<Contact> {
  const c = mockContacts.find((x) => x.id === id);
  return c
    ? Promise.resolve(c)
    : Promise.reject(new Error("Contact not found"));
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

export interface SearchContactPersonsQuery {
  q?: string;
  page?: number;
  per_page?: number;
}

// Mirrors api/src/adapter/secondary/repository/contact/contact.repo/search.ts's
// searchContactPersons — same grouping so demo mode matches real API shape.
function mockSearchPersons(
  params: SearchContactPersonsQuery,
): ContactPersonGroupList {
  const results = mockSearch(params.q ?? "");
  const groups = new Map<string, ContactPersonGroup>();
  for (const r of results) {
    const key = r.contact.name.trim().toLowerCase();
    const group = groups.get(key);
    if (group) group.entries.push(r);
    else groups.set(key, { name: r.contact.name, entries: [r] });
  }
  const sorted = Array.from(groups.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const page = params.page ?? 1;
  const perPage = params.per_page ?? 10;
  const start = (page - 1) * perPage;
  const total = sorted.length;
  return {
    items: sorted.slice(start, start + perPage),
    pagination: {
      total,
      page,
      per_page: perPage,
      last_page: Math.max(1, Math.ceil(total / perPage)),
    },
  };
}

export const contactService = {
  list: (customerId: string) =>
    DEMO_MODE
      ? Promise.resolve(mockList(customerId))
      : api.get<ContactList>("/contacts", {
          customer_id: customerId,
          per_page: 100,
        }),

  get: (id: string) =>
    DEMO_MODE ? mockGet(id) : api.get<Contact>(`/contacts/${id}`),

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

  searchPersons: (params: SearchContactPersonsQuery) =>
    DEMO_MODE
      ? Promise.resolve(mockSearchPersons(params))
      : api.get<ContactPersonGroupList>(
          "/contacts/persons",
          params as Record<string, string>,
        ),
};

function mockCreate(body: CreateContactReq): Promise<Contact> {
  const now = new Date().toISOString();
  const c: Contact = {
    ...body,
    id: `con${crypto.randomUUID()}`,
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
