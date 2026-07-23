import { mockProjects, mockProjectVisits } from "@/data/projects";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateProjectReq,
  CreateProjectVisitReq,
  Project,
  ProjectList,
  ProjectVisit,
  UpdateProjectReq,
} from "@artisancode/api-types";

export interface ProjectQuery {
  q?: string;
  status?: string;
  customerId?: string;
}

function mockList(params?: ProjectQuery): ProjectList {
  let items = mockProjects;
  if (params?.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.location ?? "").toLowerCase().includes(q),
    );
  }
  if (params?.status) items = items.filter((p) => p.status === params.status);
  if (params?.customerId)
    items = items.filter((p) => p.customerId === params.customerId);
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const projectService = {
  list: (params?: ProjectQuery) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<ProjectList>("/projects", params as Record<string, string>),

  get: (id: string) =>
    DEMO_MODE ? mockGet(id) : api.get<Project>(`/projects/${id}`),

  create: (body: CreateProjectReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<Project>("/projects", body),

  update: (id: string, body: UpdateProjectReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<Project>(`/projects/${id}`, body),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/projects/${id}`),

  listVisits: (projectId: string) =>
    DEMO_MODE
      ? Promise.resolve(
          mockProjectVisits.filter((v) => v.projectId === projectId),
        )
      : api.get<ProjectVisit[]>(`/projects/${projectId}/visits`),

  listAllVisits: () =>
    DEMO_MODE
      ? Promise.resolve(mockProjectVisits)
      : api.get<ProjectVisit[]>(`/projects/visits`),

  createVisit: (body: CreateProjectVisitReq) =>
    DEMO_MODE
      ? mockCreateVisit(body)
      : api.post<ProjectVisit>(`/projects/visits`, body),
};

function mockGet(id: string): Promise<Project> {
  const p = mockProjects.find((x) => x.id === id);
  return p
    ? Promise.resolve(p)
    : Promise.reject(new Error("Project not found"));
}

// ponytail: PRJ-{year}-{seq}, seq counted per year off the in-memory list.
function generateProjectNumber(): string {
  const year = new Date().getFullYear();
  const prefix = `PRJ-${year}-`;
  const count = mockProjects.filter((p) =>
    p.projectNumber.startsWith(prefix),
  ).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}

function mockCreate(body: CreateProjectReq): Promise<Project> {
  const now = new Date().toISOString();
  const p: Project = {
    id: `p${crypto.randomUUID()}`,
    status: body.status ?? "prospect",
    ...body,
    projectNumber: body.projectNumber || generateProjectNumber(),
    createdAt: now,
    updatedAt: now,
  };
  mockProjects.push(p);
  return Promise.resolve(p);
}

function mockUpdate(id: string, body: UpdateProjectReq): Promise<Project> {
  const idx = mockProjects.findIndex((x) => x.id === id);
  const existing = mockProjects[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Project not found"));
  const updated: Project = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockProjects[idx] = updated;
  return Promise.resolve(updated);
}

function mockDelete(id: string): Promise<void> {
  const idx = mockProjects.findIndex((x) => x.id === id);
  if (idx !== -1) mockProjects.splice(idx, 1);
  return Promise.resolve();
}

function mockCreateVisit(body: CreateProjectVisitReq): Promise<ProjectVisit> {
  const v: ProjectVisit = {
    id: `v${crypto.randomUUID()}`,
    ...body,
    createdAt: new Date().toISOString(),
  };
  mockProjectVisits.push(v);
  return Promise.resolve(v);
}
