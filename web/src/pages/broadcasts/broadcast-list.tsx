import { ArrowRight, Calendar, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBroadcasts } from "@/hooks/use-broadcasts";

import { occasionLabel, statusLabel } from "./broadcast-status";

import type { BroadcastOccasion } from "@artisancode/api-types";

export function BroadcastList() {
  const navigate = useNavigate();
  const { data } = useBroadcasts();

  const columns: Column<{
    id: string;
    name: string;
    occasion: BroadcastOccasion;
    status: "draft" | "scheduled" | "sent" | "failed";
    scheduledAt?: string;
    sentAt?: string;
    createdAt: string;
  }>[] = [
    { key: "name", label: "Nama Template", render: (t) => t.name },
    {
      key: "occasion",
      label: "Occasion",
      render: (t) => (
        <Badge variant="outline">{occasionLabel[t.occasion]}</Badge>
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
        <Button
          size="sm"
          variant="ghost"
          onClick={() => navigate(`/broadcasts/${t.id}`)}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
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

      <DataTable data={data?.items ?? []} columns={columns} />
    </div>
  );
}
