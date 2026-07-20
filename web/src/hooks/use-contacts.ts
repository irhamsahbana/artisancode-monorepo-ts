import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { contactService } from "@/services/contact";

import type {
  CreateContactReq,
  UpdateContactReq,
} from "@artisancode/api-types";

export function useContacts(customerId: string) {
  return useQuery({
    queryKey: queryKeys.contacts.list(customerId),
    queryFn: () => contactService.list(customerId),
    enabled: !!customerId,
  });
}

export function useContactSearch(q: string) {
  return useQuery({
    queryKey: queryKeys.contacts.search(q),
    queryFn: () => contactService.search(q),
  });
}

export function useCreateContact(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateContactReq) => contactService.create(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.contacts.list(customerId) }),
  });
}

export function useUpdateContact(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateContactReq) =>
      contactService.update(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.contacts.list(customerId) }),
  });
}

export function useDeleteContact(customerId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: contactService.delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.contacts.list(customerId) }),
  });
}
