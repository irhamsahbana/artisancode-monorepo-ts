import { Plus, Eye, Pencil, Users, Building2 } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategoryList } from "@/hooks/use-categories";
import { useContactSearch } from "@/hooks/use-contacts";
import { useCustomers } from "@/hooks/use-customers";

import type { ContactSearchResult, Customer } from "@artisancode/api-types";

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
  );
}

// Tab Key Person: flattened DataTable semua Contact dengan nama perusahaan.
function PersonView() {
  const navigate = useNavigate();
  const { data: allContacts } = useContactSearch("");
  const { data: customersData } = useCustomers({ per_page: 100 });

  const customerName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.items ?? []) map.set(c.id, c.name);
    return map;
  }, [customersData]);

  const columns: Column<ContactSearchResult>[] = [
    {
      key: "contactName",
      label: "Nama",
      render: (r) => (
        <div>
          <p className="text-sm font-medium">{r.contact.name}</p>
          <p className="text-xs text-muted-foreground">
            {r.contact.position ?? "-"}
          </p>
        </div>
      ),
    },
    {
      key: "customer",
      label: "Perusahaan",
      render: (r) => (
        <Link
          to={`/customers/${r.customer.id}`}
          className="flex items-center gap-1 text-sm hover:underline"
        >
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          {customerName.get(r.customer.id) ?? "-"}
        </Link>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {r.contact.whatsapp ?? "-"}
        </span>
      ),
    },
    {
      key: "isPrimary",
      label: "Utama",
      render: (r) =>
        r.contact.isPrimary ? (
          <Badge variant="secondary" className="text-[10px]">
            Ya
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">-</span>
        ),
    },
  ];

  return (
    <div>
      <DataTable
        data={allContacts ?? []}
        columns={columns}
        searchPlaceholder="Cari nama key person atau perusahaan..."
        searchFn={(r, q) =>
          r.contact.name.toLowerCase().includes(q.toLowerCase()) ||
          (r.contact.position ?? "").toLowerCase().includes(q.toLowerCase()) ||
          r.customer.name.toLowerCase().includes(q.toLowerCase())
        }
        actions={(r) => (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/customers/${r.customer.id}`)}
          >
            <Building2 className="h-4 w-4" />
          </Button>
        )}
      />
    </div>
  );
}
