import { keepPreviousData, useQueries } from "@tanstack/react-query";
import { useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";

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
  initialFilters?: Record<string, string>;
}

// Drives <DataTable> with real server pagination: owns page/search-debounce/
// filter state, re-fetches whenever any of them change. Pages 1..page are
// each their own react-query cache entry (fetched via useQueries), which
// gives us both the current page (desktop) and the accumulated list for
// mobile "load more" without a separate effect/state to keep them in sync.
export function useServerTable<T>({
  queryKey,
  fetcher,
  pageSize = 10,
  initialFilters,
}: UseServerTableOptions<T>) {
  const [page, setPage] = useState(1);
  const [queryInput, setQueryInput] = useState("");
  const debouncedQuery = useDebouncedValue(queryInput, 350);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    initialFilters ?? {},
  );

  // Reset to page 1 when the debounced query or filters actually change.
  // Setting state during render (not in an effect) is React's documented
  // way to adjust state in response to a changing input — it re-runs this
  // function immediately with the new state before anything is committed.
  const resetKey = `${debouncedQuery}|${JSON.stringify(activeFilters)}`;
  const [lastResetKey, setLastResetKey] = useState(resetKey);
  if (resetKey !== lastResetKey) {
    setLastResetKey(resetKey);
    setPage(1);
  }

  const baseParams = { q: debouncedQuery || undefined, ...activeFilters };
  const pageNumbers = Array.from({ length: page }, (_, i) => i + 1);

  const pageQueries = useQueries({
    queries: pageNumbers.map((p) => ({
      queryKey: queryKey({ ...baseParams, page: p, per_page: pageSize }),
      queryFn: () => fetcher({ ...baseParams, page: p, per_page: pageSize }),
      placeholderData: keepPreviousData,
    })),
  });

  const currentPageQuery = pageQueries[page - 1];
  const pagination = currentPageQuery?.data?.pagination;
  const totalPages = pagination?.last_page ?? 1;
  const totalCount = pagination?.total ?? 0;
  const loadedItems = pageQueries.flatMap((q) => q.data?.items ?? []);

  function handleFilterChange(key: string, value: string) {
    setActiveFilters((prev) => {
      if (value === "all") {
        return Object.fromEntries(
          Object.entries(prev).filter(([k]) => k !== key),
        );
      }
      return { ...prev, [key]: value };
    });
  }

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
    onLoadMore: () => setPage((p) => p + 1),
  };
}
