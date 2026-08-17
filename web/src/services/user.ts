import { mockUsers } from "@/data/users";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateUserAccountReq,
  UpdateUserAccountReq,
  UserAccount,
  UserAccountList,
} from "@artisancode/api-types";

export interface UserListParams {
  page?: number;
  per_page?: number;
  q?: string;
}

function mockList(params?: UserListParams): UserAccountList {
  const { q, page = 1, per_page = 100 } = params ?? {};
  let items = mockUsers;
  if (q) {
    const query = q.toLowerCase();
    items = items.filter(
      (u) =>
        u.name.toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  }
  const start = (page - 1) * per_page;
  return {
    items: items.slice(start, start + per_page),
    pagination: {
      total: items.length,
      page,
      per_page,
      last_page: Math.max(1, Math.ceil(items.length / per_page)),
    },
  };
}

function mockCreate(body: CreateUserAccountReq): Promise<UserAccount> {
  const now = new Date().toISOString();
  const user: UserAccount = {
    id: `user${crypto.randomUUID()}`,
    roleId: body.role_id,
    name: body.name,
    username: body.username,
    email: body.email,
    phone: body.phone,
    status: "active",
    isProtected: false,
    createdAt: now,
    updatedAt: now,
  };
  mockUsers.push(user);
  return Promise.resolve(user);
}

function mockUpdate(
  id: string,
  body: UpdateUserAccountReq,
): Promise<UserAccount> {
  const idx = mockUsers.findIndex((u) => u.id === id);
  const existing = mockUsers[idx];
  if (idx === -1 || !existing)
    return Promise.reject(new Error("User not found"));
  const updated: UserAccount = {
    ...existing,
    name: body.name ?? existing.name,
    email: body.email ?? existing.email,
    phone: body.phone ?? existing.phone,
    roleId: body.role_id ?? existing.roleId,
    status: body.status ?? existing.status,
    updatedAt: new Date().toISOString(),
  };
  mockUsers[idx] = updated;
  return Promise.resolve(updated);
}

function mockDelete(id: string): Promise<void> {
  const idx = mockUsers.findIndex((u) => u.id === id);
  if (idx !== -1) mockUsers.splice(idx, 1);
  return Promise.resolve();
}

export const userService = {
  list: (params?: UserListParams) =>
    DEMO_MODE
      ? Promise.resolve(mockList(params))
      : api.get<UserAccountList>(
          "/users",
          params as Record<string, string | number | boolean | undefined>,
        ),

  create: (body: CreateUserAccountReq) =>
    DEMO_MODE ? mockCreate(body) : api.post<UserAccount>("/users", body),

  update: (id: string, body: UpdateUserAccountReq) =>
    DEMO_MODE
      ? mockUpdate(id, body)
      : api.put<UserAccount>(`/users/${id}`, body),

  delete: (id: string) =>
    DEMO_MODE ? mockDelete(id) : api.del(`/users/${id}`),
};
