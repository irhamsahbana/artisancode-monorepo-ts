import { Plus, Eye, Pencil } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";

import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomers } from "@/hooks/use-customers";
import { useProjects } from "@/hooks/use-projects";

import {
  formatRupiah,
  projectStatusLabel,
  projectStatusVariant,
} from "./project-status";

import type { Project } from "@artisancode/api-types";

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

  const customerName = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of customersData?.items ?? []) map.set(c.id, c.name);
    return map;
  }, [customersData]);

  const columns: Column<Project>[] = [
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
        searchPlaceholder="Cari proyek / lokasi..."
        searchFn={(p, q) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
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
