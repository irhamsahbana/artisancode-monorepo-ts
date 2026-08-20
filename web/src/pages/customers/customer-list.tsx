import { Plus, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHasPermission } from "@/hooks/use-auth";
import { useCategoryList } from "@/hooks/use-categories";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { customerService } from "@/services/customer";

import type { Customer } from "@artisancode/api-types";

const statusLabel: Record<Customer["status"], string> = {
  active: "Aktif",
  prospect: "Prospek",
  inactive: "Tidak Aktif",
};

const statusVariant: Record<
  Customer["status"],
  "default" | "secondary" | "outline"
> = {
  active: "default",
  prospect: "secondary",
  inactive: "outline",
};

const potentialLabel: Record<Customer["potential"], string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

const columns: Column<Customer>[] = [
  {
    key: "name",
    label: "Nama Perusahaan",
    render: (c) => <span className="font-medium">{c.name}</span>,
  },
  {
    key: "status",
    label: "Status",
    render: (c) => (
      <Badge variant={statusVariant[c.status]}>{statusLabel[c.status]}</Badge>
    ),
  },
  {
    key: "potential",
    label: "Potensi",
    render: (c) => potentialLabel[c.potential],
  },
];

const filters: FilterOption[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Aktif", value: "active" },
      { label: "Prospek", value: "prospect" },
      { label: "Tidak Aktif", value: "inactive" },
    ],
  },
  {
    key: "potential",
    label: "Potensi",
    options: [
      { label: "Tinggi", value: "high" },
      { label: "Sedang", value: "medium" },
      { label: "Rendah", value: "low" },
    ],
  },
];

export function CustomerList() {
  const navigate = useNavigate();
  const canCreate = useHasPermission("customers.create");
  const canEdit = useHasPermission("customers.update");
  const { data: segmentationsData } = useCategoryList("segmentation");
  const segmentations = segmentationsData?.items ?? [];

  const allFilters: FilterOption[] = [
    ...filters,
    {
      key: "segmentation_id",
      label: "Segmentasi",
      options: segmentations.map((s) => ({ label: s.name, value: s.id })),
    },
  ];

  const table = useServerTable<Customer>({
    queryKey: (params) => queryKeys.customers.list(params),
    fetcher: (params) => customerService.list(params),
    pageSize: 10,
    filterKeys: allFilters.map((f) => f.key),
  });

  return (
    <div>
      <PageHeader
        title="Pelanggan"
        description="Kelola data pelanggan Anda."
        action={
          <Button
            size="sm"
            onClick={() => navigate("/customers/new")}
            disabled={!canCreate}
          >
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />

      <DataTable
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        searchPlaceholder="Cari nama pelanggan..."
        query={table.query}
        onQueryChange={table.onQueryChange}
        filters={allFilters}
        activeFilters={table.activeFilters}
        onFilterChange={table.onFilterChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        loading={table.loading}
        actions={(c) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/customers/${c.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/customers/${c.id}/edit`)}
              disabled={!canEdit}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
