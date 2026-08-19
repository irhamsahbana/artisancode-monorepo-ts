import { api } from "@/lib/api";

import type {
  CreateRoleReq,
  Role,
  RoleList,
  UpdateRoleReq,
} from "@artisancode/api-types";

export interface RoleListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

export const roleService = {
  list: (params?: RoleListParams) =>
    api.get<RoleList>(
      "/roles",
      params as Record<string, string | number | boolean | undefined>,
    ),

  get: (id: string) => api.get<Role>(`/roles/${id}`),

  create: (body: CreateRoleReq) => api.post<Role>("/roles", body),

  update: (id: string, body: UpdateRoleReq) =>
    api.put<Role>(`/roles/${id}`, body),

  delete: (id: string) => api.del(`/roles/${id}`),
};
