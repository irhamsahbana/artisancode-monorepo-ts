import { httpClient } from "@artisancode/http-client";

import { env } from "@/config/env";
import { api } from "@/lib/api";
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
    return Promise.resolve({ token: DEMO_TOKEN, user: DEMO_USER });
  }
  const res = await httpClient<RestResponse>(
    env.API_BASE_URL,
    "/api/users/login",
    { method: "POST", body: req },
  );
  return res.data.data as LoginRes;
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

export async function getMe(): Promise<User> {
  if (DEMO_MODE) return Promise.resolve(DEMO_USER);
  return api.get<User>("/users/me");
}
