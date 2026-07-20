import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Combobox } from "@/components/shared/combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useProducts } from "@/hooks/use-products";
import { useCreateQuotation } from "@/hooks/use-quotations";
import { useUoms } from "@/hooks/use-uoms";
import { digitsOnly, formatThousands } from "@/lib/utils";

interface FormState {
  requesterName: string;
  companyName: string;
  whatsapp: string;
  email: string;
  productName: string;
  specification: string;
  quantity: string;
  notes: string;
}

const empty: FormState = {
  requesterName: "",
  companyName: "",
  whatsapp: "",
  email: "",
  productName: "",
  specification: "",
  quantity: "",
  notes: "",
};

export function QuotationForm() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateQuotation();
  const [form, setForm] = useState<FormState>(empty);
  const [unit, setUnit] = useState("");

  const productQuery = useDebouncedValue(form.productName);
  const { data: productsData, isLoading: productsLoading } =
    useProducts(productQuery);
  const unitQuery = useDebouncedValue(unit);
  const { data: uomsData, isLoading: uomsLoading } = useUoms(unitQuery);

  const productOptions = (productsData?.items ?? []).map((p) => ({
    value: p.name,
    hint: p.unit,
  }));
  const unitOptions = (uomsData?.items ?? []).map((u) => ({
    value: u.symbol,
    hint: u.name,
  }));

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.requesterName || !form.whatsapp) {
      toast.error("Nama dan WhatsApp wajib diisi.");
      return;
    }
    try {
      await mutateAsync({
        requesterName: form.requesterName,
        companyName: form.companyName || undefined,
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        productName: form.productName || undefined,
        specification: form.specification || undefined,
        quantity: [form.quantity, unit].filter(Boolean).join(" ") || undefined,
        notes: form.notes || undefined,
      });
      toast.success("Permintaan terkirim. Kami akan segera menghubungi Anda.");
      setForm(empty);
      setUnit("");
    } catch {
      toast.error("Gagal mengirim permintaan. Coba lagi.");
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold">Permintaan Penawaran</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Isi form di bawah untuk mendapatkan penawaran produk beton precast.
            Kami akan membalas via WhatsApp dalam 1×24 jam.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Nama Lengkap" required>
                    <Input
                      required
                      value={form.requesterName}
                      onChange={(e) => set("requesterName", e.target.value)}
                      placeholder="Nama Anda"
                    />
                  </Field>
                </div>

                <Field label="Nama Perusahaan (opsional)">
                  <Input
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                    placeholder="PT / CV / UD"
                  />
                </Field>

                <Field label="WhatsApp" required>
                  <Input
                    required
                    type="tel"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    placeholder="6281234567890"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field label="Email (opsional)">
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="email@contoh.com"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Nama Produk (opsional)">
                    <Combobox
                      value={form.productName}
                      onChange={(v) => set("productName", v)}
                      options={productOptions}
                      loading={productsLoading}
                      placeholder="Pilih dari daftar atau ketik manual"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Spesifikasi Teknis (opsional)">
                    <Textarea
                      value={form.specification}
                      onChange={(e) => set("specification", e.target.value)}
                      rows={2}
                      placeholder="Kualitas beton, dimensi, standar SNI, dll."
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                  <Field label="Jumlah / Volume (opsional)">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={formatThousands(form.quantity)}
                      onChange={(e) =>
                        set("quantity", digitsOnly(e.target.value))
                      }
                      placeholder="Contoh: 500"
                    />
                  </Field>
                  <Field label="Satuan (opsional)">
                    <Combobox
                      value={unit}
                      onChange={setUnit}
                      options={unitOptions}
                      loading={uomsLoading}
                      placeholder="Pilih dari daftar atau ketik manual"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Catatan Tambahan (opsional)">
                    <Textarea
                      value={form.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      rows={3}
                      placeholder="Lokasi proyek, jadwal kebutuhan, akses truk, dll."
                    />
                  </Field>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Mengirim..." : "Kirim Permintaan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Butuh penawaran cepat? WhatsApp kami di{" "}
            <a
              href="https://wa.me/6281234567890"
              className="font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              6281234567890
            </a>
          </p>
        </div>
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
  children: React.ReactNode;
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
