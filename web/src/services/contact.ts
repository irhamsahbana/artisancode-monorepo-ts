import { api } from "@/lib/api";

import type {
  Contact,
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

export interface SearchContactPersonsQuery {
  q?: string;
  page?: number;
  per_page?: number;
}

export const contactService = {
  list: (customerId: string) =>
    api.get<ContactList>("/contacts", {
      customer_id: customerId,
      per_page: 100,
    }),

  get: (id: string) => api.get<Contact>(`/contacts/${id}`),

  create: (body: CreateContactReq) =>
    api.post<Contact>("/contacts", toSnakeBody(body)),

  update: (id: string, body: UpdateContactReq) =>
    api.put<Contact>(`/contacts/${id}`, toSnakeBody(body)),

  delete: (id: string) => api.del(`/contacts/${id}`),

  search: (q: string) =>
    api.get<ContactSearchResult[]>("/contacts/search", { q }),

  searchPersons: (params: SearchContactPersonsQuery) =>
    api.get<ContactPersonGroupList>(
      "/contacts/persons",
      params as Record<string, string>,
    ),
};

function toSnakeBody(body: object): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v]),
  );
}
