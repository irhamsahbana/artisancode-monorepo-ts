import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
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
import {
  useContact,
  useCreateContact,
  useUpdateContact,
} from "@/hooks/use-contacts";

interface FormState {
  name: string;
  position: string;
  whatsapp: string;
  email: string;
  gender: "male" | "female" | "";
  birthPlace: string;
  dateOfBirth: string;
  religion: string;
  education: string;
  address: string;
  spouseName: string;
  spouseOccupation: string;
  childrenNames: string;
  childrenOccupation: string;
  profiling: string;
  notes: string;
}

const empty: FormState = {
  name: "",
  position: "",
  whatsapp: "",
  email: "",
  gender: "",
  birthPlace: "",
  dateOfBirth: "",
  religion: "",
  education: "",
  address: "",
  spouseName: "",
  spouseOccupation: "",
  childrenNames: "",
  childrenOccupation: "",
  profiling: "",
  notes: "",
};

export function ContactForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const customerIdParam = searchParams.get("customerId") ?? "";

  const { data: existing } = useContact(id ?? "");
  const customerId = isEdit ? (existing?.customerId ?? "") : customerIdParam;
  const { mutateAsync: updateContact, isPending: updating } =
    useUpdateContact(customerId);
  const { mutateAsync: createContact, isPending: creating } =
    useCreateContact(customerId);
  const isPending = isEdit ? updating : creating;

  const [form, setForm] = useState<FormState>(empty);

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        name: existing.name,
        position: existing.position ?? "",
        whatsapp: existing.whatsapp ?? "",
        email: existing.email ?? "",
        gender: existing.gender ?? "",
        birthPlace: existing.birthPlace ?? "",
        dateOfBirth: existing.dateOfBirth ?? "",
        religion: existing.religion ?? "",
        education: existing.education ?? "",
        address: existing.address ?? "",
        spouseName: existing.spouseName ?? "",
        spouseOccupation: existing.spouseOccupation ?? "",
        childrenNames: existing.childrenNames ?? "",
        childrenOccupation: existing.childrenOccupation ?? "",
        profiling: existing.profiling ?? "",
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
      position: form.position || undefined,
      whatsapp: form.whatsapp || undefined,
      email: form.email || undefined,
      gender: form.gender || undefined,
      birthPlace: form.birthPlace || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      religion: form.religion || undefined,
      education: form.education || undefined,
      address: form.address || undefined,
      spouseName: form.spouseName || undefined,
      spouseOccupation: form.spouseOccupation || undefined,
      childrenNames: form.childrenNames || undefined,
      childrenOccupation: form.childrenOccupation || undefined,
      profiling: form.profiling || undefined,
      notes: form.notes || undefined,
    };
    try {
      if (isEdit) {
        if (!id) return;
        await updateContact({ id, ...body });
        toast.success("Key person berhasil diperbarui.");
        navigate(`/contacts/${id}`);
      } else {
        if (!customerId) return;
        const created = await createContact({ customerId, ...body });
        toast.success("Key person berhasil ditambahkan.");
        navigate(`/contacts/${created.id}`);
      }
    } catch {
      toast.error("Gagal menyimpan data key person.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Key Person" : "Tambah Key Person"}
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
                  placeholder="Nama key person"
                />
              </Field>
            </div>

            <Field label="Jabatan">
              <Input
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Direktur"
              />
            </Field>

            <Field label="WhatsApp">
              <Input
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                placeholder="628xxxxxxxxxx"
              />
            </Field>

            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@contoh.com"
              />
            </Field>

            <Field label="Jenis Kelamin">
              <Select
                value={form.gender}
                onValueChange={(v) => set("gender", v as FormState["gender"])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="sm:col-span-2">
              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                Data Pribadi
              </p>
            </div>

            <Field label="Tempat Lahir">
              <Input
                value={form.birthPlace}
                onChange={(e) => set("birthPlace", e.target.value)}
                placeholder="Makassar"
              />
            </Field>

            <Field label="Tanggal Lahir">
              <Input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => set("dateOfBirth", e.target.value)}
              />
            </Field>

            <Field label="Agama">
              <Input
                value={form.religion}
                onChange={(e) => set("religion", e.target.value)}
                placeholder="Islam"
              />
            </Field>

            <Field label="Pendidikan">
              <Input
                value={form.education}
                onChange={(e) => set("education", e.target.value)}
                placeholder="Sarjana S-1"
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Alamat">
                <Textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Alamat lengkap sesuai KTP/domisili"
                  rows={2}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                Info Keluarga
              </p>
            </div>

            <Field label="Nama Suami/Istri">
              <Input
                value={form.spouseName}
                onChange={(e) => set("spouseName", e.target.value)}
              />
            </Field>

            <Field label="Pekerjaan Suami/Istri">
              <Input
                value={form.spouseOccupation}
                onChange={(e) => set("spouseOccupation", e.target.value)}
              />
            </Field>

            <Field label="Nama Anak">
              <Input
                value={form.childrenNames}
                onChange={(e) => set("childrenNames", e.target.value)}
              />
            </Field>

            <Field label="Pekerjaan Anak">
              <Input
                value={form.childrenOccupation}
                onChange={(e) => set("childrenOccupation", e.target.value)}
              />
            </Field>

            <div className="sm:col-span-2">
              <Separator />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pt-1">
                Profiling
              </p>
            </div>

            <div className="sm:col-span-2">
              <Field label="Catatan Profiling (hobi, karakter)">
                <Textarea
                  value={form.profiling}
                  onChange={(e) => set("profiling", e.target.value)}
                  placeholder="Suka golf, ramah tapi tegas soal harga..."
                  rows={3}
                />
              </Field>
            </div>

            <div className="sm:col-span-2">
              <Field label="Catatan Lain">
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={2}
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
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
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
