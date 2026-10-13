import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { businessProfileService } from "@/services/business-profile";

export function useBusinessProfile() {
  return useQuery({
    queryKey: queryKeys.businessProfile.all,
    queryFn: businessProfileService.get,
  });
}

function useInvalidateBusinessProfile() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.businessProfile.all });
  };
}

export function useUpdateBusinessProfile() {
  const invalidate = useInvalidateBusinessProfile();
  return useMutation({
    mutationFn: businessProfileService.update,
    onSuccess: invalidate,
  });
}
