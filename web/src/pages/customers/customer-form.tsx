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
import { Textarea } from "@/components/ui/textarea";
import { useCategoryList } from "@/hooks/use-categories";
import {
  useCreateCustomer,
  useCustomer,
  useUpdateCustomer,
} from "@/hooks/use-customers";

import type { Customer } from "@artisancode/api-types";

interface FormState {
  name: string;
  segmentationId: string;
  areaId: string;
  companyType: Customer["companyType"] | "";
  status: Customer["status"];
  potential: Customer["potential"];
  address: string;
  npwp: string;
  skt: string;
  companyEmail: string;
  website: string;
  notes: string;
}

const empty: FormState = {
  name: "",
  segmentationId: "",
  areaId: "",
  companyType: "",
  status: "prospect",
  potential: "medium",
  address: "",
  npwp: "",
  skt: "",
  companyEmail: "",
  website: "",
  notes: "",
};

export function CustomerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing } = useCustomer(id ?? "");
  const { data: segmentationsData } = useCategoryList("segmentation");
  const { data: areasData } = useCategoryList("area");
  const { mutateAsync: createCustomer, isPending: creating } =
    useCreateCustomer();
  const { mutateAsync: updateCustomer, isPending: updating } =
    useUpdateCustomer(id ?? "");

  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: existing.name,
        segmentationId: existing.segmentationId ?? "",
        areaId: existing.areaId ?? "",
        companyType: existing.companyType ?? "",
        status: existing.status,
        potential: existing.potential,
        address: existing.address ?? "",
        npwp: existing.npwp ?? "",
        skt: existing.skt ?? "",
        companyEmail: existing.companyEmail ?? "",
        website: existing.website ?? "",
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
      segmentationId: form.segmentationId || undefined,
      areaId: form.areaId || undefined,
      companyType: (form.companyType as Customer["companyType"]) || undefined,
      status: form.status,
      potential: form.potential,
      address: form.address || undefined,
      npwp: form.npwp || undefined,
      skt: form.skt || undefined,
      companyEmail: form.companyEmail || undefined,
      website: form.website || undefined,
      notes: form.notes || undefined,
    };
    try {
      if (isEdit) {
        await updateCustomer(body);
        toast.success("Pelanggan berhasil diperbarui.");
        navigate(`/customers/${id}`);
      } else {
        await createCustomer(body);
        toast.success("Pelanggan berhasil ditambahkan.");
        navigate("/customers");
      }
    } catch {
      toast.error("Gagal menyimpan data pelanggan.");
    }
  }

  const segmentations =
    segmentationsData?.items.filter((s) => s.status === "active") ?? [];
  const areas = areasData?.items.filter((a) => a.status === "active") ?? [];
  const isPending = creating || updating;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Pelanggan" : "Tambah Pelanggan"}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Field label="Nama *">
                <Input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Nama pelanggan"
                />
              </Field>
            </div>

            <Field label="Segmentasi">
              <Select
                value={form.segmentationId}
                onValueChange={(v) => set("segmentationId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih segmentasi" />
                </SelectTrigger>
                <SelectContent>
                  {segmentations.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Area">
              <Select
                value={form.areaId}
                onValueChange={(v) => set("areaId", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Status *">
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as Customer["status"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="prospect">Prospek</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Potensi">
              <Select
                value={form.potential}
                onValueChange={(v) =>
                  set("potential", v as Customer["potential"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Tipe Perusahaan">
              <Select
                value={form.companyType}
                onValueChange={(v) =>
                  set("companyType", v as FormState["companyType"])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe perusahaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bumn">BUMN</SelectItem>
                  <SelectItem value="swasta_nasional">
                    Swasta Nasional
                  </SelectItem>
                  <SelectItem value="swasta_asing">Swasta Asing</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="sm:col-span-2">
              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                Info Umum Perusahaan
              </p>
            </div>

            <Field label="NPWP">
              <Input
                value={form.npwp}
                onChange={(e) => set("npwp", e.target.value)}
                placeholder="00.000.000.0-000.000"
              />
            </Field>

            <Field label="SKT">
              <Input
                value={form.skt}
                onChange={(e) => set("skt", e.target.value)}
                placeholder="Nomor Surat Keterangan Terdaftar"
              />
            </Field>

            <Field label="Email Kantor">
              <Input
                type="email"
                value={form.companyEmail}
                onChange={(e) => set("companyEmail", e.target.value)}
                placeholder="info@perusahaan.co.id"
              />
            </Field>

            <Field label="Website">
              <Input
                value={form.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://perusahaan.co.id"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Alamat">
                <Textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Alamat lengkap perusahaan"
                  rows={2}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Separator />
            </div>

            <div className="sm:col-span-2">
              <Field label="Catatan">
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Catatan tambahan..."
                  rows={3}
                />
              </Field>
            </div>

            <div className="sm:col-span-2 flex justify-end gap-2">
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
                    : "Tambah Pelanggan"}
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
