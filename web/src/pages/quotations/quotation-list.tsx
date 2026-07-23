import { Eye, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

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
import {
  useQuotations,
  useUpdateQuotationStatus,
} from "@/hooks/use-quotations";

import {
  quotationStatusLabel,
  quotationStatusVariant,
} from "./quotation-status";

import type { QuotationRequest, QuotationStatus } from "@artisancode/api-types";

const filters: FilterOption[] = [
  {
    key: "status",
    label: "Status",
    options: [
      { label: "Baru", value: "new" },
      { label: "Dalam Tinjauan", value: "in_review" },
      { label: "Direspons", value: "responded" },
    ],
  },
];

export function QuotationList() {
  const { data } = useQuotations();
  const { mutateAsync: updateStatus, isPending } = useUpdateQuotationStatus();
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<QuotationRequest | null>(null);

  const initialStatus = searchParams.get("status");
  const initialFilters = initialStatus ? { status: initialStatus } : undefined;

  async function handleStatusChange(id: string, status: QuotationStatus) {
    try {
      await updateStatus({ id, status });
      toast.success("Status diperbarui.");
    } catch {
      toast.error("Gagal memperbarui status.");
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
      key: "requesterName",
      label: "Nama Peminta",
      render: (q) => (
        <div>
          <p className="font-medium">{q.requesterName}</p>
          {q.companyName && (
            <p className="text-xs text-muted-foreground">{q.companyName}</p>
          )}
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
      key: "productName",
      label: "Produk",
      render: (q) => (
        <div>
          <p className="text-sm">{q.productName ?? "-"}</p>
          {q.specification && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {q.specification}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Jumlah",
      render: (q) => <span className="text-sm">{q.quantity ?? "-"}</span>,
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
      label: "Status",
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
              <SelectItem value="new">Baru</SelectItem>
              <SelectItem value="in_review">Dalam Tinjauan</SelectItem>
              <SelectItem value="responded">Direspons</SelectItem>
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
        description="Daftar RFQ masuk dari form publik."
      />
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        searchPlaceholder="Cari nama / perusahaan / produk..."
        searchFn={(q, search) =>
          q.requesterName.toLowerCase().includes(search.toLowerCase()) ||
          (q.companyName ?? "").toLowerCase().includes(search.toLowerCase()) ||
          (q.productName ?? "").toLowerCase().includes(search.toLowerCase())
        }
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
            <DialogTitle>Detail Permintaan Penawaran</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid gap-3 text-sm">
              <DetailRow label="Nama Peminta" value={selected.requesterName} />
              <DetailRow label="Perusahaan" value={selected.companyName} />
              <DetailRow label="WhatsApp" value={selected.whatsapp} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Produk" value={selected.productName} />
              <DetailRow label="Spesifikasi" value={selected.specification} />
              <DetailRow label="Jumlah" value={selected.quantity} />
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
