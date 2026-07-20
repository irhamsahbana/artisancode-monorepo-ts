import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { ratingService } from "@/services/rating";

export function useRatings(customerId?: string) {
  return useQuery({
    queryKey: queryKeys.ratings.list(customerId),
    queryFn: () => ratingService.list(customerId ? { customerId } : undefined),
  });
}

export function useCreateRating() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ratingService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.ratings.all }),
  });
}
