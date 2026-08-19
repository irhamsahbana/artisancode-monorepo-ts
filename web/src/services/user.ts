import { api } from "@/lib/api";

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

export const userService = {
  list: (params?: UserListParams) =>
    api.get<UserAccountList>(
      "/users",
      params as Record<string, string | number | boolean | undefined>,
    ),

  create: (body: CreateUserAccountReq) => api.post<UserAccount>("/users", body),

  update: (id: string, body: UpdateUserAccountReq) =>
    api.put<UserAccount>(`/users/${id}`, body),

  delete: (id: string) => api.del(`/users/${id}`),
};
