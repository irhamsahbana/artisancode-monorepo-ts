import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { uomService } from "@/services/uom";

import type { UpdateUnitOfMeasurementReq } from "@artisancode/api-types";

export function useUoms(q?: string) {
  return useQuery({
    queryKey: queryKeys.uoms.list(q),
    queryFn: () => uomService.list(q),
  });
}

export function useCreateUom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uomService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.uoms.all }),
  });
}

export function useUpdateUom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: { id: string } & UpdateUnitOfMeasurementReq) =>
      uomService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.uoms.all }),
  });
}
