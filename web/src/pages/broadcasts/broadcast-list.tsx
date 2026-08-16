import { Eye, Trash2, Plus, Calendar, Clock } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBroadcasts, useDeleteBroadcast } from "@/hooks/use-broadcasts";
import { useCategoryList } from "@/hooks/use-categories";
import { useClientTable } from "@/hooks/use-client-table";
import { useContactSearch } from "@/hooks/use-contacts";
import { filterAudience } from "@/services/broadcast";

import { occasionLabel, statusLabel } from "./broadcast-status";

import type { BroadcastTemplate } from "@artisancode/api-types";

const genderLabel: Record<string, string> = {
  male: "Laki-laki",
  female: "Perempuan",
};

const customerStatusLabel: Record<string, string> = {
  prospect: "Prospek",
  active: "Aktif",
  inactive: "Tidak Aktif",
};

export function BroadcastList() {
  const navigate = useNavigate();
  const { data } = useBroadcasts();
  const { data: allContacts } = useContactSearch("");
  const { data: segmentationsData } = useCategoryList("segmentation");
  const { mutate: deleteBroadcast } = useDeleteBroadcast();
  const table = useClientTable(data?.items ?? []);

  const segmentationName = useMemo(() => {
    const map = new Map<string, string>();
    for (const s of segmentationsData?.items ?? []) map.set(s.id, s.name);
    return map;
  }, [segmentationsData]);

  function recipientCount(t: BroadcastTemplate) {
    return filterAudience(allContacts ?? [], {
      gender: t.audienceGender,
      religion: t.audienceReligion,
      segmentationId: t.audienceSegmentationId,
      customerStatus: t.audienceCustomerStatus,
    }).length;
  }

  function handleDelete(t: BroadcastTemplate) {
    if (!confirm(`Hapus template "${t.name}"?`)) return;
    deleteBroadcast(t.id, {
      onSuccess: () => toast.success("Template dihapus."),
      onError: () => toast.error("Gagal menghapus template."),
    });
  }

  const columns: Column<BroadcastTemplate>[] = [
    { key: "name", label: "Nama Template", render: (t) => t.name },
    {
      key: "occasion",
      label: "Occasion",
      render: (t) => (
        <Badge variant="outline">{occasionLabel[t.occasion]}</Badge>
      ),
    },
    {
      key: "audience",
      label: "Filter Penerima",
      render: (t) => {
        const tags: string[] = [];
        if (t.audienceGender)
          tags.push(genderLabel[t.audienceGender] ?? t.audienceGender);
        if (t.audienceReligion) tags.push(t.audienceReligion);
        if (t.audienceSegmentationId)
          tags.push(
            segmentationName.get(t.audienceSegmentationId) ?? "Segmentasi",
          );
        if (t.audienceCustomerStatus)
          tags.push(
            customerStatusLabel[t.audienceCustomerStatus] ??
              t.audienceCustomerStatus,
          );
        return tags.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Semua kontak</span>
        );
      },
    },
    {
      key: "recipients",
      label: "Penerima",
      render: (t) => (
        <span className="text-sm font-medium">{recipientCount(t)} orang</span>
      ),
    },
    {
      key: "scheduledAt",
      label: "Jadwal",
      render: (t) =>
        t.scheduledAt ? (
          <div className="flex flex-col gap-0.5 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">
                {new Date(t.scheduledAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              {new Date(t.scheduledAt).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      render: (t) => (
        <Badge
          variant={
            t.status === "sent"
              ? "default"
              : t.status === "failed"
                ? "destructive"
                : "secondary"
          }
        >
          {statusLabel[t.status]}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Dibuat",
      render: (t) => t.createdAt.slice(0, 10),
    },
    {
      key: "actions",
      label: "",
      render: (t) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/broadcasts/${t.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={t.status !== "draft"}
            onClick={() => handleDelete(t)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Chat Blast / Broadcast"
        description="Kelola template pesan massal ke key person via WhatsApp (mock)."
        action={
          <Button size="sm" onClick={() => navigate("/broadcasts/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Template Baru
          </Button>
        }
      />

      <DataTable
        data={table.data}
        loadedData={table.loadedData}
        columns={columns}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
      />
    </div>
  );
}
