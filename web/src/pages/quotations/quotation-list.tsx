import { Eye, MessageCircle, Plus, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

import { Combobox } from "@/components/shared/combobox";
import type { Column, FilterOption } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";
import {
  useQuotations,
  useUpdateQuotationStatus,
  useAssignQuotation,
} from "@/hooks/use-quotations";
import {
  projectStatusLabel,
  projectStatusVariant,
} from "@/pages/projects/project-status";

import {
  quotationStatusLabel,
  quotationStatusVariant,
} from "./quotation-status";

import type { QuotationRequest, QuotationStatus } from "@artisancode/api-types";

const filters: FilterOption[] = [
  {
    key: "status",
    label: "Status Penawaran",
    options: [
      { label: "Baru Masuk", value: "new" },
      { label: "Dalam Tinjauan", value: "in_review" },
      { label: "Sudah Dikirim", value: "responded" },
    ],
  },
];

export function QuotationList() {
  const navigate = useNavigate();
  const { data } = useQuotations();
  const { data: projectsData } = useProjects();
  const { mutateAsync: updateStatus, isPending } = useUpdateQuotationStatus();
  const { mutateAsync: assignProject, isPending: isAssigning } =
    useAssignQuotation();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<QuotationRequest | null>(null);
  const [assigningQuotation, setAssigningQuotation] =
    useState<QuotationRequest | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const initialStatus = searchParams.get("status");
  const initialFilters = initialStatus ? { status: initialStatus } : undefined;
  const selectedProducts = selected?.products ?? [];

  const assignedProjectIds = new Set(
    (data?.items ?? [])
      .filter((q) => q.projectId && q.id !== assigningQuotation?.id)
      .map((q) => q.projectId),
  );
  const assignableProjects = (projectsData?.items ?? []).filter(
    (p) => !assignedProjectIds.has(p.id),
  );

  async function handleStatusChange(id: string, status: QuotationStatus) {
    try {
      await updateStatus({ id, status });
      toast.success("Status diperbarui.");
    } catch {
      toast.error("Gagal memperbarui status.");
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assigningQuotation || !selectedProjectId) return;
    try {
      await assignProject({
        id: assigningQuotation.id,
        body: { projectId: selectedProjectId },
      });
      toast.success("Penawaran berhasil di-assign ke proyek.");
      setAssigningQuotation(null);
      setSelectedProjectId("");
    } catch {
      toast.error("Gagal melakukan assign.");
    }
  }

  function formatWaLink(phone: string, message: string) {
    const cleaned = phone.replace(/\D/g, "");
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
  }

  const waMessage = (name: string) =>
    `Halo ${name}, terima kasih atas permintaan penawaran Anda. Kami sedang memproses permintaan tersebut.`;

  const columns: Column<QuotationRequest>[] = [
    {
      key: "title",
      label: "Judul Penawaran",
      render: (q) => (
        <div>
          <p className="font-medium">{q.title || "Penawaran Tanpa Judul"}</p>
          <div className="mt-0.5 flex flex-col text-xs text-muted-foreground">
            <span>Peminta: {q.requesterName}</span>
            {q.companyName && <span>Perusahaan: {q.companyName}</span>}
          </div>
        </div>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      render: (q) => (
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="h-auto p-0 text-left font-normal text-primary"
        >
          <a
            href={formatWaLink(q.whatsapp, waMessage(q.requesterName))}
            target="_blank"
            rel="noopener noreferrer"
          >
            {q.whatsapp}
          </a>
        </Button>
      ),
    },
    {
      key: "project",
      label: "Proyek",
      render: (q) => {
        const project = projectsData?.items.find((p) => p.id === q.projectId);
        if (!project)
          return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            <span className="truncate font-medium">{project.name}</span>
            <Badge
              variant={projectStatusVariant[project.status]}
              className="h-4 w-fit text-[10px] px-1.5 py-0"
            >
              {projectStatusLabel[project.status]}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "topic",
      label: "Topik",
      render: (q) => (
        <span className="text-sm text-muted-foreground">{q.topic || "-"}</span>
      ),
    },
    {
      key: "products",
      label: "Produk",
      render: (q) => {
        const [first, ...rest] = q.products ?? [];
        if (!first)
          return <span className="text-sm text-muted-foreground">-</span>;
        return (
          <div>
            <p className="text-sm">
              {first.productName}
              {first.quantity && (
                <span className="text-muted-foreground">
                  {" "}
                  · {first.quantity}
                </span>
              )}
            </p>
            {first.specification && (
              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {first.specification}
              </p>
            )}
            {rest.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                +{rest.length} produk lainnya
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Tanggal",
      render: (q) => (
        <span className="text-sm text-muted-foreground">
          {q.createdAt.slice(0, 10)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status Penawaran",
      render: (q) => {
        if (isPending) return <Badge>{quotationStatusLabel[q.status]}</Badge>;
        return (
          <Select
            defaultValue={q.status}
            onValueChange={(v) =>
              handleStatusChange(q.id, v as QuotationStatus)
            }
          >
            <SelectTrigger className="h-7 w-fit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Baru Masuk</SelectItem>
              <SelectItem value="in_review">Dalam Tinjauan</SelectItem>
              <SelectItem value="responded">Sudah Dikirim</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Permintaan Penawaran"
        description="Daftar RFQ masuk dari form publik dan internal."
        action={
          <Button size="sm" onClick={() => navigate("/quotations/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Buat Penawaran
          </Button>
        }
      />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        searchPlaceholder="Cari nama / perusahaan / produk..."
        searchFn={(q, search) => {
          const s = search.toLowerCase();
          return (
            q.requesterName.toLowerCase().includes(s) ||
            (q.companyName ?? "").toLowerCase().includes(s) ||
            (q.products ?? []).some((p) =>
              p.productName.toLowerCase().includes(s),
            )
          );
        }}
        filters={filters}
        filterFn={(q, f) =>
          Object.entries(f).every(
            ([key, val]) => q[key as keyof QuotationRequest] === val,
          )
        }
        initialFilters={initialFilters}
        actions={(q) => (
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" onClick={() => setSelected(q)}>
              <Eye className="h-4 w-4" />
            </Button>
            {!q.projectId && (
              <Button
                variant="ghost"
                size="icon"
                title="Assign ke Proyek"
                onClick={() => setAssigningQuotation(q)}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <a
                href={formatWaLink(q.whatsapp, waMessage(q.requesterName))}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Kirim WA
              </a>
            </Button>
          </div>
        )}
      />

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Penawaran</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-3 text-sm">
              <DetailRow label="Judul" value={selected.title} />
              <DetailRow label="Topik" value={selected.topic} />
              <DetailRow label="Nama Peminta" value={selected.requesterName} />
              <DetailRow label="Perusahaan" value={selected.companyName} />
              <DetailRow label="WhatsApp" value={selected.whatsapp} />
              <DetailRow label="Email" value={selected.email} />

              <div className="grid gap-2">
                <span className="text-muted-foreground">Produk Diminta</span>
                {selectedProducts.length === 0 ? (
                  <span className="text-right font-medium">-</span>
                ) : (
                  <div className="grid gap-2">
                    {selectedProducts.map((p, i) => (
                      <div key={i} className="rounded-md border p-2">
                        <p className="font-medium">{p.productName}</p>
                        {p.specification && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {p.specification}
                          </p>
                        )}
                        {p.quantity && (
                          <p className="mt-0.5 text-xs">{p.quantity}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DetailRow label="Catatan" value={selected.notes} />
              <DetailRow
                label="Tanggal Masuk"
                value={selected.createdAt.slice(0, 10)}
              />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={quotationStatusVariant[selected.status]}>
                  {quotationStatusLabel[selected.status]}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!assigningQuotation}
        onOpenChange={(v) => !v && setAssigningQuotation(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Penawaran ke Proyek</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Pilih Proyek</label>
              <Combobox
                value={selectedProjectId}
                onChange={setSelectedProjectId}
                options={assignableProjects.map((p) => ({
                  value: p.id,
                  label: `${p.name} — ${p.location}`,
                }))}
                placeholder="Pilih proyek yang ada..."
                emptyText="Semua proyek sudah punya penawaran."
                enforceOptions
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAssigningQuotation(null)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={!selectedProjectId || isAssigning}
              >
                {isAssigning ? "Menyimpan..." : "Assign"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "-"}</span>
    </div>
  );
}
