import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { categoryService } from "@/services/category";

export function useCategoryList(group?: string) {
  return useQuery({
    queryKey: queryKeys.categories.list(group),
    queryFn: () => categoryService.list(group),
  });
}

const OPTIONS_PAGE_SIZE = 20;

// Infinite, server-searched list for pickers (loads the next page on scroll).
export function useCategoryOptions(group: string, q: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.categories.options(group, q),
    initialPageParam: 1,
    // An infinite query refetches every loaded page, so avoid refetching on
    // focus/remount while the pages are still fresh.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: ({ pageParam }) =>
      categoryService.page({
        group,
        q: q || undefined,
        page: pageParam,
        limit: OPTIONS_PAGE_SIZE,
        status: "active",
        sort: "name",
      }),
    getNextPageParam: (last) =>
      last.pagination.page < last.pagination.lastPage
        ? last.pagination.page + 1
        : undefined,
  });
}

// Used to show the selected option's name even if it is not in a loaded page.
export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryService.get(id),
    enabled: !!id,
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
