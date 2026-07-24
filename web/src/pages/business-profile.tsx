import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Profile {
  name: string;
  phone: string;
  email: string;
  address: string;
}

const initial: Profile = {
  name: "CV Wika Sejahtera",
  phone: "628001234567",
  email: "info@wika.co.id",
  address: "Jl. Merdeka No. 10, Jakarta Selatan",
};

export function BusinessProfile() {
  const [form, setForm] = useState<Profile>(initial);

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profil bisnis berhasil disimpan.");
  }

  return (
    <div>
      <PageHeader
        title="Profil Bisnis"
        description="Informasi perusahaan Anda."
      />
      <Card>
        <CardContent className="pt-6">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <div className="sm:col-span-2">
              <Field label="Nama Perusahaan">
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
            </div>
            <Field label="No. Telepon">
              <Input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Alamat">
                <textarea
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </Field>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit">Simpan</Button>
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
