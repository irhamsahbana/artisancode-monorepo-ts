import { api } from "@/lib/api";

import type { DashboardMetrics } from "@artisancode/api-types";

export const dashboardService = {
  stats: () => api.get<DashboardMetrics>("/dashboard"),
};
