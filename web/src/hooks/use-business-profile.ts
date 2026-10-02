import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { businessProfileService } from "@/services/business-profile";

export function useBusinessProfile() {
  return useQuery({
    queryKey: queryKeys.businessProfile.all,
    queryFn: businessProfileService.get,
  });
}

// Public — safe to call before login, used for the browser tab title/icon.
export function useBusinessBranding() {
  return useQuery({
    queryKey: queryKeys.businessProfile.branding(),
    queryFn: businessProfileService.branding,
    staleTime: 5 * 60 * 1000,
  });
}

function useInvalidateBusinessProfile() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.businessProfile.all });
    qc.invalidateQueries({ queryKey: queryKeys.businessProfile.branding() });
  };
}

export function useUpdateBusinessProfile() {
  const invalidate = useInvalidateBusinessProfile();
  return useMutation({
    mutationFn: businessProfileService.update,
    onSuccess: invalidate,
  });
}

export function useUploadBusinessIcon() {
  const invalidate = useInvalidateBusinessProfile();
  return useMutation({
    mutationFn: businessProfileService.uploadIcon,
    onSuccess: invalidate,
  });
}

export function useDeleteBusinessIcon() {
  const invalidate = useInvalidateBusinessProfile();
  return useMutation({
    mutationFn: businessProfileService.deleteIcon,
    onSuccess: invalidate,
  });
}
