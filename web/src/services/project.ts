import { env } from "@/config/env";
import { api } from "@/lib/api";

import type {
  CreateProjectReq,
  CreateProjectVisitReq,
  Project,
  ProjectImportDryRunResult,
  ProjectImportExecuteResult,
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

  downloadTemplate: async () => {
    const token = localStorage.getItem("token") ?? "";
    const res = await fetch(`${env.API_BASE_URL}/api/projects/template`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Gagal mengunduh template Excel proyek");
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_import_project_crm_wika.xlsx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  dryRunImport: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ProjectImportDryRunResult>(
      "/projects/import/dry-run",
      formData,
    );
  },

  executeImport: (file: File, mode: "upsert" | "skip" = "skip") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
    return api.post<ProjectImportExecuteResult>("/projects/import", formData);
  },
};
