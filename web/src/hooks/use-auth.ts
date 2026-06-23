import { useMutation, useQuery } from "@tanstack/react-query";

import { login, getMe, saveToken, clearToken } from "@/services/auth";

export function useLogin() {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => saveToken(data.token),
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

export { clearToken };
