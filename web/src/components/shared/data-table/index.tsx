import { useState, useMemo } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

import { DataTableDesktopView } from "./desktop-view";
import { DataTableMobileView } from "./mobile-view";
import { DataTableToolbar } from "./toolbar";

import type { Column, FilterOption } from "./types";

export type { Column, FilterOption } from "./types";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;
  filters?: FilterOption[];
  filterFn?: (row: T, filters: Record<string, string>) => boolean;
  initialFilters?: Record<string, string>;
  pageSize?: number;
  actions?: (row: T) => React.ReactNode;
  loading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Cari...",
  searchFn,
  filters,
  filterFn,
  initialFilters,
  pageSize = 10,
  actions,
  loading,
}: Props<T>) {
  const isMobile = useIsMobile();
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
  // ponytail: mobile reuses the same `page` state as a cumulative "how many loaded" counter
  const loadedData = filtered.slice(0, page * pageSize);
  const hasMore = loadedData.length < filtered.length;

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

  const allColumns = actions
    ? [...columns, { key: "__actions", label: "", render: actions }]
    : columns;

  return (
    <div className="space-y-3">
      <DataTableToolbar
        searchPlaceholder={searchPlaceholder}
        showSearch={Boolean(searchFn)}
        query={query}
        onQueryChange={handleQueryChange}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />

      {isMobile ? (
        <DataTableMobileView
          columns={allColumns}
          rows={loadedData}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={() => setPage(page + 1)}
        />
      ) : (
        <DataTableDesktopView
          columns={allColumns}
          rows={pageData}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalCount={filtered.length}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
