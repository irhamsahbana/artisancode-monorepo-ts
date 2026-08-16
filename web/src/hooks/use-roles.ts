import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { roleService } from "@/services/role";
import type { RoleListParams } from "@/services/role";

import type { CreateRoleReq, UpdateRoleReq } from "@artisancode/api-types";

export function useRoles(params?: RoleListParams) {
  return useQuery({
    queryKey: queryKeys.roles.list(params as Record<string, unknown>),
    queryFn: () => roleService.list(params),
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: queryKeys.roles.detail(id),
    queryFn: () => roleService.get(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateRoleReq) => roleService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.roles.all }),
  });
}

export function useUpdateRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateRoleReq) => roleService.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.roles.all }),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.roles.all }),
  });
}
