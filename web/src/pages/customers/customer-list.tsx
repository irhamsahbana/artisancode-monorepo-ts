import { Plus, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryList } from "@/hooks/use-categories";
import { useCustomers } from "@/hooks/use-customers";

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
    label: "Nama",
    render: (c) => <span className="font-medium">{c.name}</span>,
  },
  {
    key: "type",
    label: "Jenis",
    render: (c) => (c.type === "business" ? "Badan Usaha" : "Perorangan"),
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
  const { data } = useCustomers({ per_page: 100 });
  const { data: segmentationsData } = useCategoryList("segmentation");

  const segmentations = segmentationsData?.items ?? [];
  const customers = data?.items ?? [];

  const allFilters: FilterOption[] = [
    ...filters,
    {
      key: "segmentationId",
      label: "Segmentasi",
      options: segmentations.map((s) => ({ label: s.name, value: s.id })),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pelanggan"
        description="Kelola data pelanggan Anda."
        action={
          <Button size="sm" onClick={() => navigate("/customers/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={customers}
        columns={columns}
        searchPlaceholder="Cari nama pelanggan..."
        searchFn={(c, q) => c.name.toLowerCase().includes(q.toLowerCase())}
        filters={allFilters}
        filterFn={(c, f) =>
          Object.entries(f).every(
            ([key, val]) => c[key as keyof Customer] === val,
          )
        }
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
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
