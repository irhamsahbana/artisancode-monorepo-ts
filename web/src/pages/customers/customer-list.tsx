import { Plus, Eye, Pencil, Users, Building2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryList } from "@/hooks/use-categories";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { contactService } from "@/services/contact";
import { customerService } from "@/services/customer";

import type { ContactPersonGroup, Customer } from "@artisancode/api-types";

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

type View = "company" | "person";

export function CustomerList() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("company");

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

      <div className="mb-4 inline-flex rounded-lg border bg-muted/40 p-1">
        <ViewToggle
          active={view === "company"}
          onClick={() => setView("company")}
          icon={<Building2 className="mr-1.5 h-4 w-4" />}
          label="Perusahaan"
        />
        <ViewToggle
          active={view === "person"}
          onClick={() => setView("person")}
          icon={<Users className="mr-1.5 h-4 w-4" />}
          label="Key Person"
        />
      </div>

      {view === "company" ? <CompanyView /> : <PersonView />}
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function CompanyView() {
  const navigate = useNavigate();
  const { data: segmentationsData } = useCategoryList("segmentation");
  const segmentations = segmentationsData?.items ?? [];

  const table = useServerTable<Customer>({
    queryKey: (params) => queryKeys.customers.list(params),
    fetcher: (params) => customerService.list(params),
    pageSize: 10,
  });

  const allFilters: FilterOption[] = [
    ...filters,
    {
      key: "segmentation_id",
      label: "Segmentasi",
      options: segmentations.map((s) => ({ label: s.name, value: s.id })),
    },
  ];

  return (
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
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  );
}

// Tab Key Person: satu baris per orang, semua perusahaan terkaitnya
// (bisa 2+ jika orang yang sama ada di beberapa perusahaan) — grouping dan
// pagination dilakukan di server (lihat contact.repo/search.ts).
function PersonView() {
  const navigate = useNavigate();

  const table = useServerTable<ContactPersonGroup>({
    queryKey: (params) => queryKeys.contacts.searchPersons(params),
    fetcher: (params) => contactService.searchPersons(params),
    pageSize: 10,
  });

  const columns: Column<ContactPersonGroup>[] = [
    {
      key: "contactName",
      label: "Nama",
      render: (g) => (
        <Link
          to={`/contacts/${g.entries[0]?.contact.id}`}
          className="block hover:underline"
        >
          <p className="text-sm font-medium">{g.name}</p>
          <p className="text-xs text-muted-foreground">
            {g.entries[0]?.contact.position ?? "-"}
          </p>
        </Link>
      ),
    },
    {
      key: "customer",
      label: "Perusahaan",
      render: (g) => (
        <div className="flex flex-col gap-1">
          {g.entries.map((r) => (
            <Link
              key={r.customer.id}
              to={`/customers/${r.customer.id}`}
              className="flex items-center gap-1 text-sm hover:underline"
            >
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              {r.customer.name}
            </Link>
          ))}
          {g.entries.length > 1 && (
            <Badge variant="outline" className="w-fit text-[10px]">
              {g.entries.length} perusahaan
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      render: (g) => (
        <span className="text-sm text-muted-foreground">
          {g.entries.find((r) => r.contact.whatsapp)?.contact.whatsapp ?? "-"}
        </span>
      ),
    },
    {
      key: "isPrimary",
      label: "Utama",
      render: (g) =>
        g.entries.some((r) => r.contact.isPrimary) ? (
          <Badge variant="secondary" className="text-[10px]">
            Ya
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <DataTable
      data={table.items}
      loadedData={table.loadedItems}
      columns={columns}
      searchPlaceholder="Cari nama key person atau perusahaan..."
      query={table.query}
      onQueryChange={table.onQueryChange}
      page={table.page}
      totalPages={table.totalPages}
      totalCount={table.totalCount}
      onPageChange={table.onPageChange}
      hasMore={table.hasMore}
      onLoadMore={table.onLoadMore}
      loading={table.loading}
      actions={(g) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/customers/${g.entries[0]?.customer.id}`)}
        >
          <Building2 className="h-4 w-4" />
        </Button>
      )}
    />
  );
}
