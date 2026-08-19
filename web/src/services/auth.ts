import { httpClient } from "@artisancode/http-client";

import { env } from "@/config/env";
import { api, camelKeys } from "@/lib/api";

import type { LoginReq, LoginRes, User } from "@artisancode/api-types";
import type { RestResponse } from "@artisancode/types";

export async function login(req: LoginReq): Promise<LoginRes> {
  const res = await httpClient<RestResponse>(
    env.API_BASE_URL,
    "/api/users/login",
    { method: "POST", body: req },
  );
  return camelKeys<LoginRes>(res.data.data);
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}

export function saveRefreshToken(token: string) {
  localStorage.setItem("refresh_token", token);
}

export function clearRefreshToken() {
  localStorage.removeItem("refresh_token");
}

export async function logout(): Promise<void> {
  try {
    await api.post("/users/logout", { refresh_token: getRefreshToken() });
  } finally {
    clearToken();
    clearRefreshToken();
  }
}

export async function getMe(): Promise<User> {
  return api.get<User>("/users/me");
}
