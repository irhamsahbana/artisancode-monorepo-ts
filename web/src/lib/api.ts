import { httpClient } from "@artisancode/http-client";

import { env } from "@/config/env";

import type { RestResponse } from "@artisancode/types";

function getToken() {
  return localStorage.getItem("token") ?? "";
}

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

function camelKeys<T>(o: unknown): T {
  if (Array.isArray(o)) return o.map(camelKeys) as T;
  if (o !== null && typeof o === "object") {
    return Object.fromEntries(
      Object.entries(o as Record<string, unknown>).map(([k, v]) => [
        toCamel(k),
        camelKeys(v),
      ]),
    ) as T;
  }
  return o as T;
}

async function call<T>(
  path: string,
  options?: Parameters<typeof httpClient>[2],
): Promise<T> {
  const res = await httpClient<RestResponse>(env.API_BASE_URL, `/api${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${getToken()}`, ...options?.headers },
  });
  return camelKeys<T>(res.data.data);
}

export const api = {
  get: <T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ) => call<T>(path, { method: "GET", query }),
  post: <T>(path: string, body: unknown) =>
    call<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) =>
    call<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => call<T>(path, { method: "DELETE" }),
};
