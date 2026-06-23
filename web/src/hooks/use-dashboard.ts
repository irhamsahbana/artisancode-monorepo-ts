import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { dashboardService } from "@/services/dashboard";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.stats,
  });
}
