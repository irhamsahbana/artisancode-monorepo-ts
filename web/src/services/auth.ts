import { httpClient } from "@artisancode/http-client";

import { env } from "@/config/env";

import type { LoginReq, LoginRes, User } from "@artisancode/api-types";
import type { RestResponse } from "@artisancode/types";

export async function login(req: LoginReq): Promise<LoginRes> {
  const res = await httpClient<RestResponse>(
    env.API_BASE_URL,
    "/api/users/login",
    {
      method: "POST",
      body: req,
    },
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
  const token = getToken();
  const res = await httpClient<RestResponse>(
    env.API_BASE_URL,
    "/api/users/me",
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data.data as User;
}
