import { Plus, Eye, Pencil } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContactSearch } from "@/hooks/use-contacts";
import { useCustomers } from "@/hooks/use-customers";
import { useProjects } from "@/hooks/use-projects";
import { useQuotations } from "@/hooks/use-quotations";
import {
  quotationStatusLabel,
  quotationStatusVariant,
} from "@/pages/quotations/quotation-status";

import {
  formatRupiah,
  projectStatusLabel,
  projectStatusVariant,
} from "./project-status";

import type { Project, QuotationRequest } from "@artisancode/api-types";

const filters: FilterOption[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Prospek", value: "prospect" },
      { label: "Sedang Proses", value: "in_progress" },
      { label: "Berhasil", value: "won" },
      { label: "Gagal", value: "lost" },
    ],
  },
];

export function ProjectList() {
  const navigate = useNavigate();
  const { data } = useProjects();
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { data: contactResults } = useContactSearch("");
  const { data: quotationsData } = useQuotations();

  const customerName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.items ?? []) map.set(c.id, c.name);
    return map;
  }, [customersData]);

  const contactName = useMemo(() => {
    const map = new Map<string, string>();
    for (const r of contactResults ?? []) map.set(r.contact.id, r.contact.name);
    return map;
  }, [contactResults]);

  const quotationByProject = useMemo(() => {
    const map = new Map<string, QuotationRequest>();
    for (const q of quotationsData?.items ?? []) {
      if (q.projectId) map.set(q.projectId, q);
    }
    return map;
  }, [quotationsData]);

  const columns: Column<Project>[] = [
    {
      key: "projectNumber",
      label: "Nomor Proyek",
      render: (p) => (
        <span className="font-mono text-xs text-muted-foreground">
          {p.projectNumber}
        </span>
      ),
    },
    {
      key: "name",
      label: "Nama Proyek",
      render: (p) => <span className="font-medium">{p.name}</span>,
    },
    {
      key: "customer",
      label: "Pelanggan",
      render: (p) => customerName.get(p.customerId) ?? "-",
    },
    {
      key: "contact",
      label: "PIC Pelanggan",
      render: (p) =>
        p.contactId ? (contactName.get(p.contactId) ?? "-") : "-",
    },
    { key: "location", label: "Lokasi", render: (p) => p.location ?? "-" },
    {
      key: "status",
      label: "Status",
      render: (p) => (
        <Badge variant={projectStatusVariant[p.status]}>
          {projectStatusLabel[p.status]}
        </Badge>
      ),
    },
    {
      key: "quotation",
      label: "Penawaran",
      render: (p) => {
        const q = quotationByProject.get(p.id);
        if (!q) return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">{q.title || "-"}</span>
            <Badge
              variant={quotationStatusVariant[q.status]}
              className="h-4 w-fit px-1.5 py-0 text-[10px]"
            >
              {quotationStatusLabel[q.status]}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "value",
      label: "Nilai Estimasi",
      render: (p) => formatRupiah(p.estimatedValue),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Monitoring Proyek"
        description="Pantau proyek yang sedang di-follow up."
        action={
          <Button size="sm" onClick={() => navigate("/projects/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        searchPlaceholder="Cari nomor proyek / nama / lokasi..."
        searchFn={(p, q) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.projectNumber.toLowerCase().includes(q.toLowerCase()) ||
          (p.location ?? "").toLowerCase().includes(q.toLowerCase())
        }
        filters={filters}
        filterFn={(p, f) =>
          Object.entries(f).every(
            ([key, val]) => p[key as keyof Project] === val,
          )
        }
        actions={(p) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/projects/${p.id}`)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/projects/${p.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
