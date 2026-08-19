import { api } from "@/lib/api";

import type {
  CreateProjectReq,
  CreateProjectVisitReq,
  Project,
  ProjectList,
  ProjectMapMarker,
  ProjectVisit,
  UpdateProjectReq,
} from "@artisancode/api-types";

export interface ProjectQuery {
  q?: string;
  status?: string;
  customerId?: string;
  page?: number;
  per_page?: number;
}

export const projectService = {
  list: (params?: ProjectQuery) =>
    api.get<ProjectList>("/projects", params as Record<string, string>),

  listMapMarkers: () => api.get<ProjectMapMarker[]>("/projects/map"),

  get: (id: string) => api.get<Project>(`/projects/${id}`),

  create: (body: CreateProjectReq) => api.post<Project>("/projects", body),

  update: (id: string, body: UpdateProjectReq) =>
    api.put<Project>(`/projects/${id}`, body),

  delete: (id: string) => api.del(`/projects/${id}`),

  listVisits: (projectId: string) =>
    api.get<ProjectVisit[]>(`/projects/${projectId}/visits`),

  listAllVisits: () => api.get<ProjectVisit[]>(`/projects/visits`),

  createVisit: (body: CreateProjectVisitReq) =>
    api.post<ProjectVisit>(`/projects/visits`, body),
};
