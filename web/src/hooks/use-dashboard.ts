import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { queryKeys } from "@/lib/query-keys";
import { dashboardService } from "@/services/dashboard";

import { useProjects } from "./use-projects";

import type { ProjectStatus } from "@artisancode/api-types";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: dashboardService.stats,
  });
}

const PIPELINE_STATUS_ORDER: ProjectStatus[] = [
  "prospect",
  "in_progress",
  "won",
  "lost",
];

// ponytail: no dedicated pipeline endpoint yet, so this derives totals from
// useProjects. Swap the body for a real dashboardService.pipeline() call once
// the API exists — callers won't need to change.
export function useProjectPipeline() {
  const { data, isLoading } = useProjects();

  const pipeline = useMemo(() => {
    const totals = new Map<
      ProjectStatus,
      { count: number; totalValue: number }
    >();
    for (const p of data?.items ?? []) {
      const entry = totals.get(p.status) ?? { count: 0, totalValue: 0 };
      entry.count += 1;
      entry.totalValue += p.estimatedValue ?? 0;
      totals.set(p.status, entry);
    }
    return PIPELINE_STATUS_ORDER.map((status) => ({
      status,
      count: totals.get(status)?.count ?? 0,
      totalValue: totals.get(status)?.totalValue ?? 0,
    }));
  }, [data]);

  return { data: pipeline, isLoading };
}
