import { useIsMobile } from "@/hooks/use-mobile";

import { DataTableDesktopView } from "./desktop-view";
import { DataTableMobileView } from "./mobile-view";
import { DataTableToolbar } from "./toolbar";

import type { Column, FilterOption } from "./types";

export type { Column, FilterOption } from "./types";

interface Props<T> {
  data: T[];
  loadedData?: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  query?: string;
  onQueryChange?: (value: string) => void;
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  actions?: (row: T) => React.ReactNode;
  loading?: boolean;
}

// Server-driven: `data`/`loadedData` are already the fetched page(s) — no
// client-side search/filter/slice happens here. Pair with useServerTable.
export function DataTable<T>({
  data,
  loadedData,
  columns,
  searchPlaceholder = "Cari...",
  query = "",
  onQueryChange,
  filters,
  activeFilters = {},
  onFilterChange,
  page,
  totalPages,
  totalCount,
  onPageChange,
  hasMore = false,
  onLoadMore,
  actions,
  loading,
}: Props<T>) {
  const isMobile = useIsMobile();

  const allColumns = actions
    ? [...columns, { key: "__actions", label: "", render: actions }]
    : columns;

  return (
    <div className="space-y-3">
      <DataTableToolbar
        searchPlaceholder={searchPlaceholder}
        showSearch={Boolean(onQueryChange)}
        query={query}
        onQueryChange={onQueryChange}
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={onFilterChange}
      />

      {isMobile ? (
        <DataTableMobileView
          columns={allColumns}
          rows={loadedData ?? data}
          loading={loading}
          hasMore={hasMore}
          onLoadMore={onLoadMore}
        />
      ) : (
        <DataTableDesktopView
          columns={allColumns}
          rows={data}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
