import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { unitConversionService } from "@/services/unit-conversion";

import type { UpdateUnitConversionReq } from "@artisancode/api-types";

export function useUnitConversions() {
  return useQuery({
    queryKey: queryKeys.unitConversions.list(),
    queryFn: () => unitConversionService.list(),
  });
}

export function useCreateUnitConversion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unitConversionService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.unitConversions.all }),
  });
}

export function useUpdateUnitConversion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string } & UpdateUnitConversionReq) =>
      unitConversionService.update(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.unitConversions.all }),
  });
}
