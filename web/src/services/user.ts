import { mockUsers } from "@/data/users";
import { api } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type {
  CreateUserAccountReq,
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
    createdAt: now,
    updatedAt: now,
  };
  mockUsers.push(user);
  return Promise.resolve(user);
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
};
