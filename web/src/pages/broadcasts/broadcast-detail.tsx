import { ArrowLeft, Clock, Send, Users } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useHasPermission } from "@/hooks/use-auth";
import {
  useBroadcasts,
  useSendBroadcast,
  useBroadcastLogs,
} from "@/hooks/use-broadcasts";
import { useCategoryList } from "@/hooks/use-categories";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { contactService } from "@/services/contact";

import { occasionLabel, statusLabel } from "./broadcast-status";

import type { ContactSearchResult } from "@artisancode/api-types";

interface FormState {
  name: string;
  message: string;
  occasion: string;
  gender: string;
  religion: string;
  segmentationId: string;
  customerStatus: string;
  scheduledAt: string;
}

export function BroadcastDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canSendBroadcast = useHasPermission("broadcast_logs.create");
  const { data: broadcasts } = useBroadcasts();
  const { mutateAsync: send, isPending: isSending } = useSendBroadcast();
  const { data: segmentationsData } = useCategoryList("segmentation");
  const { data: broadcastLogs } = useBroadcastLogs(id);

  const broadcast = broadcasts?.items.find((b) => b.id === id);
  // ponytail: only drafts are editable — scheduled is "final" (locked in),
  // sent/failed means it already ran, also locked.
  const isEditable = broadcast?.status === "draft";

  const [form, setForm] = useState<FormState>({
    name: "",
    message: "",
    occasion: "thank_you",
    gender: "",
    religion: "",
    segmentationId: "",
    customerStatus: "",
    scheduledAt: "",
  });

  const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(
    new Set(),
  );

  const contactTable = useServerTable<ContactSearchResult>({
    queryKey: (params) => queryKeys.contacts.searchPersons(params),
    fetcher: async (params) => {
      const result = await contactService.searchPersons(params);
      const flattenedItems = result.items.flatMap((group) => group.entries);
      return { items: flattenedItems, pagination: result.pagination };
    },
    pageSize: 10,
  });

  // useBroadcasts() resolves after this component's first render, so seeding
  // `form`/the audience filters from `broadcast` in useState's initializer
  // would just capture undefined — sync here instead once it's loaded.
  const [syncedBroadcastId, setSyncedBroadcastId] = useState<string | null>(
    null,
  );
  if (broadcast && broadcast.id !== syncedBroadcastId) {
    setSyncedBroadcastId(broadcast.id);
    setForm({
      name: broadcast.name,
      message: broadcast.message,
      occasion: broadcast.occasion,
      gender: broadcast.audienceGender ?? "",
      religion: broadcast.audienceReligion ?? "",
      segmentationId: broadcast.audienceSegmentationId ?? "",
      customerStatus: broadcast.audienceCustomerStatus ?? "",
      scheduledAt: broadcast.scheduledAt ?? "",
    });
    contactTable.onFilterChange("gender", broadcast.audienceGender ?? "");
    contactTable.onFilterChange("religion", broadcast.audienceReligion ?? "");
    contactTable.onFilterChange(
      "segmentationId",
      broadcast.audienceSegmentationId ?? "",
    );
    contactTable.onFilterChange(
      "customerStatus",
      broadcast.audienceCustomerStatus ?? "",
    );
  }

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  // Audience filter selects drive both the template's audience criteria
  // (form state) and the live "Target Penerima" preview (table filters).
  function setAudienceFilter(
    key: "gender" | "religion" | "segmentationId" | "customerStatus",
    value: string,
  ) {
    set(key, value);
    contactTable.onFilterChange(key, value);
  }

  const religions = useMemo(() => {
    const set = new Set<string>();
    for (const r of contactTable.loadedItems)
      if (r.customer.religion) set.add(r.customer.religion);
    return Array.from(set).sort();
  }, [contactTable.loadedItems]);

  function handleSelectAll(checked: boolean) {
    const next = new Set(selectedContactIds);
    if (checked) {
      contactTable.loadedItems.forEach((r) => next.add(r.contact.id));
    } else {
      next.clear();
    }
    setSelectedContactIds(next);
  }

  function toggleContactId(contactId: string, checked: boolean) {
    setSelectedContactIds((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(contactId);
      } else {
        next.delete(contactId);
      }
      return next;
    });
  }

  // Build contact status map from logs. broadcastLogs is ordered newest-first
  // (desc sentAt), so keep only the first entry seen per contact — otherwise
  // an older resend log processed later would overwrite the latest status.
  const contactStatusMap = useMemo(() => {
    const map = new Map<string, "pending" | "sent" | "failed">();
    for (const log of broadcastLogs ?? []) {
      if (log.recipientLogs) {
        for (const recipient of log.recipientLogs) {
          if (!map.has(recipient.contactId)) {
            map.set(recipient.contactId, recipient.status);
          }
        }
      }
    }
    return map;
  }, [broadcastLogs]);

  async function handleSend() {
    if (!broadcast || selectedContactIds.size === 0) {
      toast.error("Pilih minimal satu penerima.");
      return;
    }
    try {
      await send({
        templateId: broadcast.id,
        recipientCount: selectedContactIds.size,
      });
      toast.success("Broadcast berhasil dikirim.");
      navigate("/broadcasts");
    } catch {
      toast.error("Gagal mengirim broadcast.");
    }
  }

  const segmentations = segmentationsData?.items ?? [];

  const contactColumns: Column<ContactSearchResult>[] = [
    ...(isEditable
      ? [
          {
            key: "select",
            label: "Pilih",
            render: (r: ContactSearchResult) => (
              <input
                type="checkbox"
                checked={selectedContactIds.has(r.contact.id)}
                onChange={(e) =>
                  toggleContactId(r.contact.id, e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300"
              />
            ),
          },
        ]
      : []),
    {
      key: "name",
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
      render: (r) => r.customer.name,
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
      key: "status",
      label: "Status",
      render: (r) => {
        const status = contactStatusMap.get(r.contact.id);
        if (!status) {
          // No logs yet - show pending for drafts/scheduled
          return <Badge variant="secondary">Pending</Badge>;
        }
        if (status === "sent") {
          return <Badge variant="default">Terkirim</Badge>;
        }
        if (status === "failed") {
          return <Badge variant="destructive">Gagal</Badge>;
        }
        return <Badge variant="secondary">Pending</Badge>;
      },
    },
  ];

  if (!broadcast) {
    return (
      <div>
        <p className="text-muted-foreground">Template tidak ditemukan.</p>
      </div>
    );
  }

  const canEdit = isEditable;
  const canSend =
    broadcast.status === "draft" || broadcast.status === "scheduled";

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{broadcast.name}</h1>
            <p className="text-sm text-muted-foreground">
              {broadcast.id} •{" "}
              <Badge variant="outline">{statusLabel[broadcast.status]}</Badge>
            </p>
          </div>
        </div>
        {canSend && (
          <Button
            onClick={handleSend}
            disabled={
              isSending || selectedContactIds.size === 0 || !canSendBroadcast
            }
          >
            <Send className="mr-2 h-4 w-4" />
            {isSending ? "Mengirim..." : "Kirim Sekarang"}
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Detail Template
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Nama Template">
              <Input value={form.name} disabled={!canEdit} />
            </Field>

            <Field label="Occasion">
              <Select value={form.occasion} disabled={true}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(occasionLabel).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Pesan Template">
              <Textarea rows={4} value={form.message} disabled={!canEdit} />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Dibuat">
                <Input
                  value={new Date(broadcast.createdAt).toLocaleString("id-ID")}
                  disabled
                />
              </Field>
              <Field label="Jadwal Kirim">
                <Input
                  value={
                    form.scheduledAt
                      ? new Date(form.scheduledAt).toLocaleString("id-ID")
                      : "Segera (Send Now)"
                  }
                  disabled
                />
              </Field>
            </div>

            {broadcast.sentAt && (
              <Field label="Terkirim">
                <Input
                  value={new Date(broadcast.sentAt).toLocaleString("id-ID")}
                  disabled
                />
              </Field>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Target Penerima ({contactTable.totalCount} key person)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Jenis Kelamin">
                <Select
                  value={form.gender}
                  onValueChange={(v) => setAudienceFilter("gender", v)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua</SelectItem>
                    <SelectItem value="male">Laki-laki</SelectItem>
                    <SelectItem value="female">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Agama">
                <Select
                  value={form.religion}
                  onValueChange={(v) => setAudienceFilter("religion", v)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua</SelectItem>
                    {religions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Segmentasi Perusahaan">
                <Select
                  value={form.segmentationId}
                  onValueChange={(v) => setAudienceFilter("segmentationId", v)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua</SelectItem>
                    {segmentations.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status Pelanggan">
                <Select
                  value={form.customerStatus}
                  onValueChange={(v) => setAudienceFilter("customerStatus", v)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua</SelectItem>
                    <SelectItem value="prospect">Prospek</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {isEditable && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    contactTable.loadedItems.length > 0 &&
                    contactTable.loadedItems.every((r) =>
                      selectedContactIds.has(r.contact.id),
                    )
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-muted-foreground">
                  Pilih Semua (
                  <span className="font-medium">{selectedContactIds.size}</span>
                  /
                  <span className="font-medium">
                    {contactTable.loadedItems.length}
                  </span>
                  )
                </span>
              </div>
            )}

            <DataTable
              data={contactTable.items}
              loadedData={contactTable.loadedItems}
              columns={contactColumns}
              searchPlaceholder="Cari nama key person / perusahaan..."
              query={contactTable.query}
              onQueryChange={contactTable.onQueryChange}
              page={contactTable.page}
              totalPages={contactTable.totalPages}
              totalCount={contactTable.totalCount}
              onPageChange={contactTable.onPageChange}
              hasMore={contactTable.hasMore}
              onLoadMore={contactTable.onLoadMore}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
