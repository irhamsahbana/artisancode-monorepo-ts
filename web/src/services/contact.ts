import { api } from "@/lib/api";

import type {
  Contact,
  CreateContactReq,
  UpdateContactReq,
} from "@artisancode/api-types";

export interface ContactList {
  items: Contact[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    lastPage: number;
  };
}

export const contactService = {
  list: (customerId: string) =>
    api.get<ContactList>("/contacts", {
      customer_id: customerId,
      per_page: 100,
    }),

  create: (body: CreateContactReq) =>
    api.post<Contact>("/contacts", {
      customer_id: body.customerId,
      name: body.name,
      position: body.position,
      whatsapp: body.whatsapp,
      email: body.email,
      notes: body.notes,
      is_primary: body.isPrimary,
    }),

  update: (id: string, body: UpdateContactReq) =>
    api.put<Contact>(`/contacts/${id}`, {
      name: body.name,
      position: body.position,
      whatsapp: body.whatsapp,
      email: body.email,
      notes: body.notes,
      is_primary: body.isPrimary,
    }),

  delete: (id: string) => api.del(`/contacts/${id}`),
};
