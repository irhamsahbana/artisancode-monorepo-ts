import { mockRoles } from "@/data/roles";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateRoleReq,
  Role,
  RoleList,
  UpdateRoleReq,
} from "@artisancode/api-types";

function mockList(q?: string): RoleList {
  let items = mockRoles;
  if (q) {
    const query = q.toLowerCase();
    items = items.filter((r) => r.name.toLowerCase().includes(query));
  }
  return {
    items,
    pagination: { total: items.length, page: 1, per_page: 100, last_page: 1 },
  };
}

export const roleService = {
  list: (q?: string) =>
    DEMO_MODE
      ? Promise.resolve(mockList(q))
      : api.get<RoleList>("/roles", { q, per_page: 100 }),

  get: (id: string) =>
    DEMO_MODE ? mockGet(id) : api.get<Role>(`/roles/${id}`),

  create: (body: CreateRoleReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<Role>("/roles", body),

  update: (id: string, body: UpdateRoleReq) =>
    DEMO_MODE ? mockUpdate(id, body) : api.put<Role>(`/roles/${id}`, body),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/roles/${id}`),
};

function mockGet(id: string): Promise<Role> {
  const role = mockRoles.find((r) => r.id === id);
  if (!role) return Promise.reject(new Error("Role not found"));
  return Promise.resolve(role);
}

function mockCreate(body: CreateRoleReq): Promise<Role> {
  const now = new Date().toISOString();
  const role: Role = {
    id: `role${crypto.randomUUID()}`,
    name: body.name,
    description: body.description,
    permissions: body.permissions,
    isSystem: false,
    createdAt: now,
    updatedAt: now,
  };
  mockRoles.push(role);
  return Promise.resolve(role);
}

function mockUpdate(id: string, body: UpdateRoleReq): Promise<Role> {
  const idx = mockRoles.findIndex((r) => r.id === id);
  const existing = mockRoles[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("Role not found"));
  const updated: Role = {
    ...existing,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  mockRoles[idx] = updated;
  return Promise.resolve(updated);
}

function mockDelete(id: string): Promise<void> {
  const idx = mockRoles.findIndex((r) => r.id === id);
  if (idx !== -1) mockRoles.splice(idx, 1);
  return Promise.resolve();
}
