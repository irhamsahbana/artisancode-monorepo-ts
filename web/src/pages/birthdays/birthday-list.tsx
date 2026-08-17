import { Clock, Gift } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useBirthdayGreetingLogs,
  useBirthdayGreetingSettings,
  useUpdateBirthdayGreetingSettings,
} from "@/hooks/use-birthday-greeting";
import { useCategoryList } from "@/hooks/use-categories";
import { useClientTable } from "@/hooks/use-client-table";
import { useContactSearch } from "@/hooks/use-contacts";

// Fixed daily fire time for the cronbake scheduler (api/src/jobs/scheduler.ts)
const BIRTHDAY_SEND_TIME = "08:00 WIB";

interface UpcomingBirthday {
  contactId: string;
  contactName: string;
  gender?: "male" | "female";
  customerName: string;
  position: string;
  dateOfBirth: string;
  nextBirthday: Date;
  daysUntil: number;
}

interface SettingsForm {
  message: string;
  enabled: boolean;
  gender: string;
  religion: string;
  segmentationId: string;
  customerStatus: string;
}

export function BirthdayList() {
  const canUpdate = useHasPermission("birthday_greeting.update");
  const { data: settings } = useBirthdayGreetingSettings();
  const { mutateAsync: updateSettings, isPending: isSaving } =
    useUpdateBirthdayGreetingSettings();
  const { data: contactsData } = useContactSearch("");
  const { data: segmentationsData } = useCategoryList("segmentation");
  const { data: logs } = useBirthdayGreetingLogs();

  const [form, setForm] = useState<SettingsForm>({
    message: "",
    enabled: false,
    gender: "",
    religion: "",
    segmentationId: "",
    customerStatus: "",
  });

  // Sync local form state whenever fresh settings arrive from the server —
  // adjusted during render (React's recommended pattern) instead of an
  // Effect, keyed off updatedAt so a save's own refetch doesn't clobber
  // in-flight edits with stale-looking (but actually current) data.
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  if (settings && settings.updatedAt !== syncedAt) {
    setSyncedAt(settings.updatedAt);
    setForm({
      message: settings.message,
      enabled: settings.enabled,
      gender: settings.audienceGender ?? "",
      religion: settings.audienceReligion ?? "",
      segmentationId: settings.audienceSegmentationId ?? "",
      customerStatus: settings.audienceCustomerStatus ?? "",
    });
  }

  function set<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      await updateSettings({
        message: form.message,
        enabled: form.enabled,
        audienceGender: (form.gender as "male" | "female") || undefined,
        audienceReligion: form.religion || undefined,
        audienceSegmentationId: form.segmentationId || undefined,
        audienceCustomerStatus: form.customerStatus || undefined,
      });
      toast.success("Pengaturan automasi berhasil disimpan.");
    } catch {
      toast.error("Gagal menyimpan pengaturan.");
    }
  }

  // The scheduler fires once daily — find the log from today's run, if any.
  const todayLog = useMemo(() => {
    const todayKey = new Date().toDateString();
    return (logs ?? [])
      .filter((l) => new Date(l.sentAt).toDateString() === todayKey)
      .sort((a, b) => b.sentAt.localeCompare(a.sentAt))[0];
  }, [logs]);

  const todayStatusByContact = useMemo(() => {
    const map = new Map<string, "sent" | "failed">();
    for (const r of todayLog?.recipientLogs ?? []) {
      map.set(r.contactId, r.status);
    }
    return map;
  }, [todayLog]);

  const religions = useMemo(() => {
    const set = new Set<string>();
    for (const { customer } of contactsData ?? []) {
      if (customer.religion) set.add(customer.religion);
    }
    return Array.from(set).sort();
  }, [contactsData]);

  const upcomingList = useMemo(() => {
    const items: UpcomingBirthday[] = [];
    const now = new Date();
    // Normalize to midnight for accurate day difference
    now.setHours(0, 0, 0, 0);

    for (const { contact, customer } of contactsData ?? []) {
      if (!customer.dateOfBirth) continue;

      const dob = new Date(customer.dateOfBirth);
      const nextBirthday = new Date(
        now.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      );

      // If it already passed this year, next birthday is next year
      if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
      }

      const diffTime = nextBirthday.getTime() - now.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      items.push({
        contactId: contact.id,
        contactName: contact.name,
        gender: customer.gender ?? undefined,
        customerName: customer.name,
        position: contact.position ?? "-",
        dateOfBirth: customer.dateOfBirth,
        nextBirthday,
        daysUntil,
      });
    }

    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [contactsData]);

  const table = useClientTable(upcomingList);

  const columns: Column<UpcomingBirthday>[] = [
    {
      key: "contact",
      label: "Key Person",
      render: (u) => {
        const sapaan = u.gender === "female" ? "Ibu" : "Bapak";
        return (
          <div className="flex flex-col gap-0.5">
            <Link
              to={`/contacts/${u.contactId}`}
              className="font-medium hover:underline"
            >
              {sapaan} {u.contactName}
            </Link>
            <span className="text-xs text-muted-foreground">{u.position}</span>
          </div>
        );
      },
    },
    {
      key: "company",
      label: "Pelanggan",
      render: (u) => <span className="text-sm">{u.customerName}</span>,
    },
    {
      key: "date",
      label: "Tanggal Lahir",
      render: (u) => (
        <span className="text-sm">
          {new Date(u.dateOfBirth).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "countdown",
      label: "Jadwal",
      render: (u) => {
        if (u.daysUntil === 0) {
          return <Badge variant="default">Hari ini</Badge>;
        }
        if (u.daysUntil === 1) {
          return <Badge variant="secondary">Besok</Badge>;
        }
        return (
          <span className="text-sm text-muted-foreground">
            {u.daysUntil} hari lagi
          </span>
        );
      },
    },
    {
      key: "status_kirim",
      label: "Status Pengiriman",
      render: (u) => {
        if (u.daysUntil !== 0) {
          return (
            <span className="text-sm text-muted-foreground">
              Belum waktunya
            </span>
          );
        }
        if (!settings?.enabled) {
          return <Badge variant="outline">Automasi nonaktif</Badge>;
        }
        const status = todayStatusByContact.get(u.contactId);
        if (status === "sent") {
          return (
            <Badge className="bg-green-600 text-white hover:bg-green-700">
              Terkirim
            </Badge>
          );
        }
        if (status === "failed") {
          return <Badge variant="destructive">Gagal</Badge>;
        }
        if (todayLog) {
          // Job already ran today but this contact didn't match the
          // settings' audience filters (gender/religion/segmentasi/status).
          return <Badge variant="outline">Di luar target</Badge>;
        }
        return <Badge variant="outline">Menunggu {BIRTHDAY_SEND_TIME}</Badge>;
      },
    },
  ];

  const segmentations = segmentationsData?.items ?? [];

  return (
    <div>
      <PageHeader
        title="Ulang Tahun Key Person"
        description="Daftar ulang tahun dan automasi pengiriman ucapan selamat."
      />

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Gift className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">
                Automasi Ucapan Ulang Tahun
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                {form.enabled
                  ? "Aktif — dikirim otomatis via WhatsApp setiap hari pukul"
                  : "Nonaktif"}
                {form.enabled && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 h-5 font-medium flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {BIRTHDAY_SEND_TIME}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => set("enabled", e.target.checked)}
              disabled={!canUpdate}
              className="h-4 w-4 rounded border-gray-300"
            />
            Aktifkan
          </label>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1.5">
            <Label>Pesan</Label>
            <Textarea
              rows={5}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              disabled={!canUpdate}
              placeholder="Selamat Ulang Tahun {{nama}}! ..."
            />
            <p className="text-xs text-muted-foreground">
              Gunakan <b>{`{{nama}}`}</b> untuk otomatis diganti nama tiap
              penerima.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="grid gap-1.5">
              <Label>Jenis Kelamin</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => set("gender", v)}
                disabled={!canUpdate}
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
            </div>

            <div className="grid gap-1.5">
              <Label>Agama</Label>
              <Select
                value={form.religion}
                onValueChange={(v) => set("religion", v)}
                disabled={!canUpdate}
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
            </div>

            <div className="grid gap-1.5">
              <Label>Segmentasi Perusahaan</Label>
              <Select
                value={form.segmentationId}
                onValueChange={(v) => set("segmentationId", v)}
                disabled={!canUpdate}
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
            </div>

            <div className="grid gap-1.5">
              <Label>Status Pelanggan</Label>
              <Select
                value={form.customerStatus}
                onValueChange={(v) => set("customerStatus", v)}
                disabled={!canUpdate}
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
            </div>
          </div>

          {canUpdate && (
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="mb-4 text-base font-semibold">
        Daftar Ulang Tahun Mendatang
      </h2>
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
