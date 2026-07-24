import { ArrowLeft, Building2, Users } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
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
import { useCreateBroadcast } from "@/hooks/use-broadcasts";
import { useCategoryList } from "@/hooks/use-categories";
import { useContactSearch } from "@/hooks/use-contacts";

import { occasionLabel } from "./broadcast-status";

import type {
  BroadcastOccasion,
  ContactSearchResult,
} from "@artisancode/api-types";

interface FormState {
  name: string;
  message: string;
  occasion: BroadcastOccasion;
  gender: string;
  religion: string;
  segmentationId: string;
  customerStatus: string;
  selectedContactIds: Set<string>;
  scheduleType: "now" | "later";
  scheduledAt: string;
}

const empty: FormState = {
  name: "",
  message: "",
  occasion: "thank_you",
  gender: "",
  religion: "",
  segmentationId: "",
  customerStatus: "",
  selectedContactIds: new Set<string>(),
  scheduleType: "now",
  scheduledAt: "",
};

export function BroadcastForm() {
  const navigate = useNavigate();
  const { mutateAsync: create, isPending } = useCreateBroadcast();
  const { data: allContacts } = useContactSearch("");
  const { data: segmentationsData } = useCategoryList("segmentation");

  const [form, setForm] = useState<FormState>(empty);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  const religions = useMemo(() => {
    const set = new Set<string>();
    for (const r of allContacts ?? [])
      if (r.contact.religion) set.add(r.contact.religion);
    return Array.from(set).sort();
  }, [allContacts]);

  // ponytail: filter the same contactService results the Key Person tab uses,
  // so "Target Penerima" is just a filtered view of the contacts service.
  const matchingContacts = useMemo(() => {
    let items = allContacts ?? [];
    if (form.gender)
      items = items.filter((r) => r.contact.gender === form.gender);
    if (form.religion)
      items = items.filter((r) => r.contact.religion === form.religion);
    if (form.segmentationId)
      items = items.filter(
        (r) => r.customer.segmentationId === form.segmentationId,
      );
    if (form.customerStatus)
      items = items.filter((r) => r.customer.status === form.customerStatus);
    return items;
  }, [
    allContacts,
    form.gender,
    form.religion,
    form.segmentationId,
    form.customerStatus,
  ]);

  function handleSelectAll(checked: boolean) {
    setForm((prev) => {
      const next = new Set(prev.selectedContactIds);
      if (checked) {
        matchingContacts.forEach((r) => next.add(r.contact.id));
      } else {
        next.clear();
      }
      return { ...prev, selectedContactIds: next };
    });
  }

  function toggleContactId(contactId: string, checked: boolean) {
    setForm((prev) => {
      const next = new Set(prev.selectedContactIds);
      if (checked) {
        next.add(contactId);
      } else {
        next.delete(contactId);
      }
      return { ...prev, selectedContactIds: next };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error("Nama dan pesan wajib diisi.");
      return;
    }
    try {
      await create({
        name: form.name,
        message: form.message,
        occasion: form.occasion,
        audienceGender: (form.gender as "male" | "female") || undefined,
        audienceReligion: form.religion || undefined,
        audienceSegmentationId: form.segmentationId || undefined,
        audienceCustomerStatus: form.customerStatus || undefined,
        scheduledAt:
          form.scheduleType === "later" && form.scheduledAt
            ? form.scheduledAt
            : undefined,
      });
      toast.success("Template tersimpan.");
      navigate("/broadcasts");
    } catch {
      toast.error("Gagal menyimpan template.");
    }
  }

  const segmentations = segmentationsData?.items ?? [];

  const contactColumns: Column<ContactSearchResult>[] = [
    {
      key: "select",
      label: "Pilih",
      render: (r) => (
        <input
          type="checkbox"
          checked={form.selectedContactIds.has(r.contact.id)}
          onChange={(e) => toggleContactId(r.contact.id, e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
    },
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
      render: (r) => (
        <span className="flex items-center gap-1 text-sm">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          {r.customer.name}
        </span>
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
  ];

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Template Broadcast Baru</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <Field label="Nama Template" required>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Contoh: Ucapan Selamat Hari Raya"
                />
              </Field>

              <Field label="Occasion">
                <Select
                  value={form.occasion}
                  onValueChange={(v) => set("occasion", v as BroadcastOccasion)}
                >
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

              <Field label="Pesan Template" required>
                <Textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Isi pesan yang akan dikirim..."
                />
              </Field>

              <Field label="Jadwal Pengiriman">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={form.scheduleType === "now"}
                      onChange={() => {
                        set("scheduleType", "now");
                        set("scheduledAt", "");
                      }}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Kirim Sekarang</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scheduleType"
                      checked={form.scheduleType === "later"}
                      onChange={() => set("scheduleType", "later")}
                      className="h-4 w-4"
                    />
                    <span className="text-sm">Jadwalkan</span>
                  </label>
                </div>
                {form.scheduleType === "later" && (
                  <Input
                    type="datetime-local"
                    value={form.scheduledAt}
                    onChange={(e) => set("scheduledAt", e.target.value)}
                    className="mt-2"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                )}
              </Field>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Menyimpan..." : "Simpan Template"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              Target Penerima ({matchingContacts.length} key person)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Field label="Jenis Kelamin">
                <Select
                  value={form.gender}
                  onValueChange={(v) => set("gender", v)}
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
                  onValueChange={(v) => set("religion", v)}
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
                  onValueChange={(v) => set("segmentationId", v)}
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
                  onValueChange={(v) => set("customerStatus", v)}
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

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  matchingContacts.length > 0 &&
                  matchingContacts.every((r) =>
                    form.selectedContactIds.has(r.contact.id),
                  )
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm text-muted-foreground">
                Pilih Semua (
                <span className="font-medium">
                  {form.selectedContactIds.size}
                </span>
                /<span className="font-medium">{matchingContacts.length}</span>)
              </span>
            </div>

            <DataTable
              data={matchingContacts}
              columns={contactColumns}
              searchPlaceholder="Cari nama key person / perusahaan..."
              searchFn={(r, q) =>
                r.contact.name.toLowerCase().includes(q.toLowerCase()) ||
                r.customer.name.toLowerCase().includes(q.toLowerCase())
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}
