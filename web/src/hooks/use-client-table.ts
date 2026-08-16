import { useMemo, useState } from "react";

interface UseClientTableOptions<T> {
  searchFn?: (row: T, query: string) => boolean;
  filterFn?: (row: T, filters: Record<string, string>) => boolean;
  pageSize?: number;
  initialFilters?: Record<string, string>;
}

// Same client-side search/filter/paginate behavior <DataTable> used to do
// internally, now lifted into a hook so pages that aren't on server
// pagination yet can keep working unchanged against the now-controlled
// <DataTable>. Prefer useServerTable for anything fetching from the API.
export function useClientTable<T>(
  data: T[],
  {
    searchFn,
    filterFn,
    pageSize = 10,
    initialFilters,
  }: UseClientTableOptions<T> = {},
) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    initialFilters ?? {},
  );
  const [page, setPage] = useState(1);

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

  function handleQueryChange(value: string) {
    setQuery(value);
    setPage(1);
  }

  function handleFilterChange(key: string, value: string) {
    setPage(1);
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
    onLoadMore: () => setPage((p) => p + 1),
  };
}
