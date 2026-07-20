import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCustomers } from "@/hooks/use-customers";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/hooks/use-projects";

import type { ProjectStatus } from "@artisancode/api-types";

interface FormState {
  name: string;
  customerId: string;
  location: string;
  sourceOfFunds: string;
  picName: string;
  status: ProjectStatus;
  estimatedValue: string;
  spkNumber: string;
  lostReason: string;
  winnerCompetitor: string;
  notes: string;
}

const empty: FormState = {
  name: "",
  customerId: "",
  location: "",
  sourceOfFunds: "",
  picName: "",
  status: "prospect",
  estimatedValue: "",
  spkNumber: "",
  lostReason: "",
  winnerCompetitor: "",
  notes: "",
};

export function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing } = useProject(id ?? "");
  const { data: customersData } = useCustomers({ per_page: 100 });
  const { mutateAsync: createProject, isPending: creating } =
    useCreateProject();
  const { mutateAsync: updateProject, isPending: updating } = useUpdateProject(
    id ?? "",
  );

  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: existing.name,
        customerId: existing.customerId,
        location: existing.location ?? "",
        sourceOfFunds: existing.sourceOfFunds ?? "",
        picName: existing.picName ?? "",
        status: existing.status,
        estimatedValue: existing.estimatedValue?.toString() ?? "",
        spkNumber: existing.spkNumber ?? "",
        lostReason: existing.lostReason ?? "",
        winnerCompetitor: existing.winnerCompetitor ?? "",
        notes: existing.notes ?? "",
      });
    }
  }, [existing]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = {
      name: form.name,
      customerId: form.customerId,
      location: form.location || undefined,
      sourceOfFunds: form.sourceOfFunds || undefined,
      picName: form.picName || undefined,
      status: form.status,
      estimatedValue: form.estimatedValue
        ? Number(form.estimatedValue)
        : undefined,
      spkNumber:
        form.status === "won" ? form.spkNumber || undefined : undefined,
      lostReason:
        form.status === "lost" ? form.lostReason || undefined : undefined,
      winnerCompetitor:
        form.status === "lost" ? form.winnerCompetitor || undefined : undefined,
      notes: form.notes || undefined,
    };
    try {
      if (isEdit) {
        await updateProject(body);
        toast.success("Proyek berhasil diperbarui.");
        navigate(`/projects/${id}`);
      } else {
        await createProject(body);
        toast.success("Proyek berhasil ditambahkan.");
        navigate("/projects");
      }
    } catch {
      toast.error("Gagal menyimpan data proyek.");
    }
  }

  const customers = customersData?.items ?? [];
  const isPending = creating || updating;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Proyek" : "Tambah Proyek"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Nama Proyek *">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Contoh: Pembangunan Gedung Perkantoran"
                />
              </Field>
            </div>

            <Field label="Pelanggan *">
              <Select
                value={form.customerId}
                onValueChange={(v) => set("customerId", v)}
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Lokasi">
              <Input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="Kota / wilayah proyek"
              />
            </Field>

            <Field label="Sumber Dana">
              <Input
                value={form.sourceOfFunds}
                onChange={(e) => set("sourceOfFunds", e.target.value)}
                placeholder="APBN / APBD / Swasta"
              />
            </Field>

            <Field label="PIC (Sales)">
              <Input
                value={form.picName}
                onChange={(e) => set("picName", e.target.value)}
                placeholder="Nama PIC internal"
              />
            </Field>

            <Field label="Status *">
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as ProjectStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospek</SelectItem>
                  <SelectItem value="in_progress">Sedang Proses</SelectItem>
                  <SelectItem value="won">Berhasil</SelectItem>
                  <SelectItem value="lost">Gagal</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Nilai Estimasi (Rp)">
              <Input
                type="number"
                value={form.estimatedValue}
                onChange={(e) => set("estimatedValue", e.target.value)}
                placeholder="0"
              />
            </Field>

            {form.status === "won" && (
              <div className="sm:col-span-2">
                <Separator />
                <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Detail Berhasil
                </p>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <Field label="Nomor SPK">
                    <Input
                      value={form.spkNumber}
                      onChange={(e) => set("spkNumber", e.target.value)}
                      placeholder="SPK/.../2024/..."
                    />
                  </Field>
                </div>
              </div>
            )}

            {form.status === "lost" && (
              <div className="sm:col-span-2">
                <Separator />
                <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Detail Gagal
                </p>
                <div className="mt-3 grid gap-5 sm:grid-cols-2">
                  <Field label="Alasan Gagal">
                    <Input
                      value={form.lostReason}
                      onChange={(e) => set("lostReason", e.target.value)}
                      placeholder="Harga / spesifikasi / dll."
                    />
                  </Field>
                  <Field label="Pesaing Pemenang">
                    <Input
                      value={form.winnerCompetitor}
                      onChange={(e) => set("winnerCompetitor", e.target.value)}
                      placeholder="Nama kompetitor"
                    />
                  </Field>
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <Separator />
              <Field label="Catatan">
                <textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={3}
                  placeholder="Catatan tambahan..."
                  className="flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? "Menyimpan..."
                  : isEdit
                    ? "Simpan Perubahan"
                    : "Tambah Proyek"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
