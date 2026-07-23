import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { projectService, type ProjectQuery } from "@/services/project";

import type {
  CreateProjectVisitReq,
  UpdateProjectReq,
} from "@artisancode/api-types";

export function useProjects(params?: ProjectQuery) {
  return useQuery({
    queryKey: queryKeys.projects.list(params as Record<string, unknown>),
    queryFn: () => projectService.list(params),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.get(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateProjectReq) => projectService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.projects.all });
      qc.invalidateQueries({ queryKey: queryKeys.projects.detail(id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.projects.all }),
  });
}

export function useProjectVisits(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.visits(projectId),
    queryFn: () => projectService.listVisits(projectId),
    enabled: !!projectId,
  });
}

export function useAllProjectVisits() {
  return useQuery({
    queryKey: queryKeys.projects.allVisits(),
    queryFn: projectService.listAllVisits,
  });
}

export function useCreateProjectVisit(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProjectVisitReq) =>
      projectService.createVisit(body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.projects.visits(projectId) }),
  });
}
