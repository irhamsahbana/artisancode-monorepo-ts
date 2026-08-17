import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useServerTable } from "@/hooks/use-server-table";
import { useUpdateUom } from "@/hooks/use-uoms";
import { queryKeys } from "@/lib/query-keys";
import { uomService } from "@/services/uom";

import { UomDialog } from "./uom-dialog";

import type {
  UnitOfMeasurement,
  UnitOfMeasurementCategory,
} from "@artisancode/api-types";

// ponytail: hardcoded category set (not master data) — see
// UNIT_OF_MEASUREMENT_CATEGORIES in @artisancode/api-types, the source of
// truth both this Select and any future BE schema enum validate against.
export const categoryLabel: Record<UnitOfMeasurementCategory, string> = {
  length: "Panjang",
  area: "Luas",
  volume: "Volume",
  mass: "Massa",
  time: "Waktu",
  quantity: "Jumlah",
  other: "Lainnya",
};

export const categoryOptions = Object.entries(categoryLabel).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const categoryFilters: FilterOption[] = [
  { key: "category", label: "Kategori", options: categoryOptions },
];

export function Uoms() {
  const { mutate: update } = useUpdateUom();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UnitOfMeasurement | null>(null);

  const table = useServerTable<UnitOfMeasurement>({
    queryKey: (params) => queryKeys.uoms.list(params),
    fetcher: (params) => uomService.list(params),
    pageSize: 10,
  });

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: UnitOfMeasurement) {
    setEditing(item);
    setOpen(true);
  }

  function toggleActive(item: UnitOfMeasurement) {
    update(
      { id: item.id, isActive: !item.isActive },
      {
        onSuccess: () =>
          toast.success(item.isActive ? "Dinonaktifkan." : "Diaktifkan."),
      },
    );
  }

  const columns: Column<UnitOfMeasurement>[] = [
    {
      key: "name",
      label: "Nama Satuan",
      render: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "symbol",
      label: "Simbol",
      render: (i) => i.symbol,
    },
    {
      key: "category",
      label: "Kategori",
      render: (i) => (
        <Badge variant="outline">{categoryLabel[i.category]}</Badge>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (i) => (
        <Badge
          variant={i.isActive ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleActive(i)}
        >
          {i.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Satuan"
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        loading={table.loading}
        searchPlaceholder="Cari satuan..."
        query={table.query}
        onQueryChange={table.onQueryChange}
        filters={categoryFilters}
        activeFilters={table.activeFilters}
        onFilterChange={table.onFilterChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <UomDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
