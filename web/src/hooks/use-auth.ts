import { useMutation, useQuery } from "@tanstack/react-query";

import {
  login,
  getMe,
  saveToken,
  saveRefreshToken,
  logout,
} from "@/services/auth";

import type { Permission } from "@artisancode/api-types";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveToken(data.token);
      saveRefreshToken(data.refreshToken);
    },
  });
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
  });
}

// ponytail: reads straight from the useMe() cache — no separate permissions
// store needed, `/users/me` is already the single source of truth for it.
export function useHasPermission(permission: Permission): boolean {
  const { data } = useMe();
  return data?.permissions?.includes(permission) ?? false;
}

export { logout };
