import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountSettings() {
  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("admin@wika.co.id");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  function handleProfile(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Profil akun berhasil diperbarui.");
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Password tidak cocok.");
      return;
    }
    toast.success("Password berhasil diubah.");
    setPassword("");
    setConfirm("");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Akun" description="Kelola informasi akun Anda." />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfile} className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Nama</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ubah Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePassword} className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Password Baru</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Konfirmasi Password</Label>
              <Input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <Button type="submit" variant="outline">
                Ubah Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
