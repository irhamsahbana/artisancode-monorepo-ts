import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { quotationService } from "@/services/quotation";

import type { QuotationStatus } from "@artisancode/api-types";

export function useQuotations() {
  return useQuery({
    queryKey: queryKeys.quotations.list(),
    queryFn: () => quotationService.list(),
  });
}

export function useCreateQuotation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: quotationService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.quotations.all }),
  });
}

export function useUpdateQuotationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuotationStatus }) =>
      quotationService.updateStatus(id, status),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.quotations.all }),
  });
}
