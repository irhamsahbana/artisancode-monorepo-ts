import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIsMobile } from "@/hooks/use-mobile";

import type { PaginationMetadata } from "@artisancode/api-types";

export interface ServerTableParams {
  page: number;
  per_page: number;
  q?: string;
  [key: string]: string | number | boolean | undefined;
}

interface UseServerTableOptions<T> {
  queryKey: (params: ServerTableParams) => readonly unknown[];
  fetcher: (params: ServerTableParams) => Promise<{
    items: T[];
    pagination: PaginationMetadata;
  }>;
  pageSize?: number;
  // Filter keys this table owns (e.g. ["status", "potential"]) — read
  // straight off the URL with no prefix, so the URL matches the API 1:1.
  // Needed because other reserved keys ("page", "q") share the same query
  // string and must not be picked up as filters.
  filterKeys?: string[];
}

// Drives <DataTable> with real server pagination: owns page/search-debounce/
// filter state in the URL query string ("page", "q", "<filter-key>") instead
// of local useState, so the current view is a copy-pasteable link that reads
// the same as the API params. Re-fetches whenever any of them change. Desktop
// fetches only the open page; mobile fetches pages 1..page (each its own
// react-query cache entry via useQueries) to build the accumulated "load
// more" list without a separate effect/state to keep in sync.
export function useServerTable<T>({
  queryKey,
  fetcher,
  pageSize = 10,
  filterKeys = [],
}: UseServerTableOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const queryInput = searchParams.get("q") ?? "";
  const debouncedQuery = useDebouncedValue(queryInput, 350);

  const activeFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    for (const key of filterKeys) {
      const value = searchParams.get(key);
      if (value) filters[key] = value;
    }
    return filters;
  }, [searchParams, filterKeys]);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutate(next);
        return next;
      },
      { replace: true },
    );
  }

  function setPage(next: number | ((p: number) => number)) {
    const value = typeof next === "function" ? next(page) : next;
    updateParams((params) => {
      if (value <= 1) params.delete("page");
      else params.set("page", String(value));
    });
  }

  function setQueryInput(value: string) {
    updateParams((params) => {
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
    });
  }

  function handleFilterChange(key: string, value: string) {
    updateParams((params) => {
      if (!value || value === "all") params.delete(key);
      else params.set(key, value);
      params.delete("page");
    });
  }

  const baseParams = { q: debouncedQuery || undefined, ...activeFilters };
  const pageNumbers = isMobile
    ? Array.from({ length: page }, (_, i) => i + 1)
    : [page];

  const pageQueries = useQueries({
    queries: pageNumbers.map((p) => ({
      queryKey: queryKey({ ...baseParams, page: p, per_page: pageSize }),
      queryFn: () => fetcher({ ...baseParams, page: p, per_page: pageSize }),
      placeholderData: keepPreviousData,
    })),
  });

  const currentPageQuery = pageQueries[pageQueries.length - 1];
  // ponytail: lib/api camelCases every response key, so the runtime field is
  // lastPage even though PaginationMetadata says last_page. Fix the shared
  // types if more snake_case fields start being read.
  const pagination = currentPageQuery?.data?.pagination as
    | { total: number; lastPage: number }
    | undefined;
  const totalPages = pagination?.lastPage ?? 1;
  const totalCount = pagination?.total ?? 0;
  const loadedItems = pageQueries.flatMap((q) => q.data?.items ?? []);

  return {
    items: currentPageQuery?.data?.items ?? [],
    loading: pageQueries.some((q) => q.isLoading),
    page,
    totalPages,
    totalCount,
    onPageChange: setPage,
    query: queryInput,
    onQueryChange: setQueryInput,
    activeFilters,
    onFilterChange: handleFilterChange,
    loadedItems,
    hasMore: loadedItems.length < totalCount,
    onLoadMore: () => setPage((p: number) => p + 1),
  };
}
