import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { categoryService } from "@/services/category";

export function useCategoryList(group?: string) {
  return useQuery({
    queryKey: queryKeys.categories.list(group),
    queryFn: () => categoryService.list(group),
  });
}

export function useCreateCategory(group: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => categoryService.create(group, name),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories.list(group) }),
  });
}

export function useUpdateCategory(group: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      name?: string;
      status?: string;
    }) => categoryService.update(id, body),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories.list(group) }),
  });
}

export function useDeleteCategory(group: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.categories.list(group) }),
  });
}
