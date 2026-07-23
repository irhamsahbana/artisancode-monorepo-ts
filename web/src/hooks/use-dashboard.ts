import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { queryKeys } from "@/lib/query-keys";
import { dashboardService } from "@/services/dashboard";

import { useAllProjectVisits, useProjects } from "./use-projects";

import type { Project, ProjectStatus } from "@artisancode/api-types";

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

const FOLLOW_UP_STATUSES: ProjectStatus[] = ["prospect", "in_progress"];
const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface ProjectFollowUp {
  project: Project;
  lastVisitDate: string | null;
  daysSinceLastVisit: number | null;
}

// ponytail: same story as useProjectPipeline — derives from useProjects +
// useAllProjectVisits until there's a dedicated endpoint. Sorted by urgency
// (never-visited first, then longest since last visit) rather than a fixed
// day threshold, so it stays meaningful regardless of demo-data staleness.
export function useProjectFollowUps() {
  const { data: projectData, isLoading: projectsLoading } = useProjects();
  const { data: visits, isLoading: visitsLoading } = useAllProjectVisits();
  // ponytail: frozen at mount rather than read fresh per render — this hook
  // only needs to be "roughly now" for a days-ago display, not live-updating.
  const [now] = useState(() => Date.now());

  const followUps = useMemo(() => {
    const lastVisitByProject = new Map<string, string>();
    for (const v of visits ?? []) {
      const current = lastVisitByProject.get(v.projectId);
      if (!current || v.visitDate > current) {
        lastVisitByProject.set(v.projectId, v.visitDate);
      }
    }

    const result: ProjectFollowUp[] = (projectData?.items ?? [])
      .filter((p) => FOLLOW_UP_STATUSES.includes(p.status))
      .map((project) => {
        const lastVisitDate = lastVisitByProject.get(project.id) ?? null;
        const daysSinceLastVisit = lastVisitDate
          ? Math.floor((now - new Date(lastVisitDate).getTime()) / MS_PER_DAY)
          : null;
        return { project, lastVisitDate, daysSinceLastVisit };
      });

    return result.sort(
      (a, b) =>
        (b.daysSinceLastVisit ?? Infinity) - (a.daysSinceLastVisit ?? Infinity),
    );
  }, [projectData, visits, now]);

  return { data: followUps, isLoading: projectsLoading || visitsLoading };
}
