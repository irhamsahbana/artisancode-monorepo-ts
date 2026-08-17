import { httpClient } from "@artisancode/http-client";
import { AppError, ErrorCode } from "@artisancode/types";

import { env } from "@/config/env";

import type { RestResponse } from "@artisancode/types";

function getToken() {
  return localStorage.getItem("token") ?? "";
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function saveTokens(token: string, refreshToken: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("refresh_token", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
}

function logoutRedirect() {
  clearTokens();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function toCamel(s: string) {
  return s.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
}

export function camelKeys<T>(o: unknown): T {
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

// ponytail: module-level promise so concurrent 401s from several in-flight
// requests share one refresh call instead of racing each other.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.resolve(null);

  if (!refreshPromise) {
    refreshPromise = httpClient<RestResponse>(
      env.API_BASE_URL,
      "/api/users/refresh-token",
      { method: "POST", body: { refresh_token: refreshToken } },
    )
      .then((res) => {
        const data = camelKeys<{ token: string; refreshToken: string }>(
          res.data.data,
        );
        saveTokens(data.token, data.refreshToken);
        return data.token;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function call<T>(
  path: string,
  options?: Parameters<typeof httpClient>[2],
): Promise<T> {
  const request = (token: string) =>
    httpClient<RestResponse>(env.API_BASE_URL, `/api${path}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options?.headers },
    });

  try {
    const res = await request(getToken());
    return camelKeys<T>(res.data.data);
  } catch (error) {
    if (error instanceof AppError && error.httpCode === 401) {
      const code = (error.data as RestResponse | undefined)?.code;
      if (code === ErrorCode.AUTH_TOKEN_EXPIRED) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const res = await request(newToken);
            return camelKeys<T>(res.data.data);
          } catch (retryError) {
            if (retryError instanceof AppError && retryError.httpCode === 401) {
              logoutRedirect();
            }
            throw retryError;
          }
        }
      }
      logoutRedirect();
    }
    throw error;
  }
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
