import { useMemo } from "react";
import { useSearchParams } from "react-router";

interface UseClientTableOptions<T> {
  searchFn?: (row: T, query: string) => boolean;
  filterFn?: (row: T, filters: Record<string, string>) => boolean;
  pageSize?: number;
}

const FILTER_PREFIX = "f_";

// Same client-side search/filter/paginate behavior <DataTable> used to do
// internally, now lifted into a hook so pages that aren't on server
// pagination yet can keep working unchanged against the now-controlled
// <DataTable>. State lives in the URL ("page", "q", "f_<key>") so the
// current view is a copy-pasteable link, same as useServerTable.
// Prefer useServerTable for anything fetching from the API.
export function useClientTable<T>(
  data: T[],
  { searchFn, filterFn, pageSize = 10 }: UseClientTableOptions<T> = {},
) {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const activeFilters = useMemo(() => {
    const filters: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith(FILTER_PREFIX)) {
        filters[key.slice(FILTER_PREFIX.length)] = value;
      }
    }
    return filters;
  }, [searchParams]);

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

  function handleQueryChange(value: string) {
    updateParams((params) => {
      if (value) params.set("q", value);
      else params.delete("q");
      params.delete("page");
    });
  }

  function handleFilterChange(key: string, value: string) {
    updateParams((params) => {
      if (value === "all") params.delete(`${FILTER_PREFIX}${key}`);
      else params.set(`${FILTER_PREFIX}${key}`, value);
      params.delete("page");
    });
  }

  const filtered = useMemo(() => {
    let rows = data;
    if (query && searchFn) rows = rows.filter((r) => searchFn(r, query));
    if (Object.keys(activeFilters).length && filterFn)
      rows = rows.filter((r) => filterFn(r, activeFilters));
    return rows;
  }, [data, query, activeFilters, searchFn, filterFn]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);
  const loadedData = filtered.slice(0, page * pageSize);

  return {
    data: pageData,
    loadedData,
    page,
    totalPages,
    totalCount: filtered.length,
    onPageChange: setPage,
    query,
    onQueryChange: handleQueryChange,
    activeFilters,
    onFilterChange: handleFilterChange,
    hasMore: loadedData.length < filtered.length,
    onLoadMore: () => setPage((p: number) => p + 1),
  };
}
