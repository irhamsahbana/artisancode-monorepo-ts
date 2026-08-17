import { httpClient } from "@artisancode/http-client";

import { env } from "@/config/env";
import { api, camelKeys } from "@/lib/api";
import { DEMO_MODE } from "@/lib/demo-mode";

import type { LoginReq, LoginRes, User } from "@artisancode/api-types";
import type { RestResponse } from "@artisancode/types";

// ponytail: demo session gated behind one fixed credential pair so
// ProtectedRoute + useMe work without a backend. Flip DEMO_MODE to restore.
const DEMO_USER: User = {
  id: "u1",
  name: "Super Admin",
  email: "admin@wikabeton.id",
};
const DEMO_PASSWORD = "wikabeton123";
const DEMO_TOKEN = "demo-token";

export async function login(req: LoginReq): Promise<LoginRes> {
  if (DEMO_MODE) {
    if (req.email !== DEMO_USER.email || req.password !== DEMO_PASSWORD) {
      return Promise.reject(new Error("Invalid credentials"));
    }
    return Promise.resolve({
      token: DEMO_TOKEN,
      refreshToken: DEMO_TOKEN,
      user: DEMO_USER,
    });
  }
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
  if (DEMO_MODE) return;
  try {
    await api.post("/users/logout", { refresh_token: getRefreshToken() });
  } finally {
    clearToken();
    clearRefreshToken();
  }
}

export async function getMe(): Promise<User> {
  if (DEMO_MODE) return Promise.resolve(DEMO_USER);
  return api.get<User>("/users/me");
}
