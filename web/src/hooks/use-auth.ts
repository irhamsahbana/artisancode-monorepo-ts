import { useMutation, useQuery } from "@tanstack/react-query";

import {
  login,
  getMe,
  saveToken,
  saveRefreshToken,
  logout,
} from "@/services/auth";

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

export { logout };
