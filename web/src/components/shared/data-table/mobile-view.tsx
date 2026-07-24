import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { EmptyState } from "../empty-state";

import type { Column } from "./types";

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function DataTableMobileView<T>({
  columns,
  rows,
  loading,
  hasMore,
  onLoadMore,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-3">
      {loading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Memuat...
        </p>
      ) : rows.length === 0 ? (
        <EmptyState />
      ) : (
        rows.map((row, i) => (
          <Card key={i} className="gap-2 py-4">
            <CardContent className="space-y-1.5 px-4">
              {columns.map((c) =>
                c.key === "__actions" ? (
                  <div key={c.key} className="flex justify-end pt-1">
                    {c.render(row)}
                  </div>
                ) : (
                  <div
                    key={c.key}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    {c.label && (
                      <span className="text-muted-foreground">{c.label}</span>
                    )}
                    <span className="text-right">{c.render(row)}</span>
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        ))
      )}

      {hasMore && (
        <Button variant="outline" className="w-full" onClick={onLoadMore}>
          Muat lebih banyak
        </Button>
      )}
    </div>
  );
}
