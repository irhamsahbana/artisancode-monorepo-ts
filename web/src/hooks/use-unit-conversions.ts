import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { unitConversionService } from "@/services/unit-conversion";
import type { UnitConversionListParams } from "@/services/unit-conversion";

import type { UpdateUnitConversionReq } from "@artisancode/api-types";

export function useUnitConversions(params?: UnitConversionListParams) {
  return useQuery({
    queryKey: queryKeys.unitConversions.list(params as Record<string, unknown>),
    queryFn: () => unitConversionService.list(params),
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
