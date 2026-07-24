import { PERMISSION_ACTIONS, PERMISSION_MODULES } from "@artisancode/api-types";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateRole, useRole, useUpdateRole } from "@/hooks/use-roles";
import { cn } from "@/lib/utils";

import type { Permission } from "@artisancode/api-types";

export function RoleForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing } = useRole(id ?? "");
  const { mutateAsync: createRole, isPending: creating } = useCreateRole();
  const { mutateAsync: updateRole, isPending: updating } = useUpdateRole(
    id ?? "",
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<Set<Permission>>(new Set());

  useEffect(() => {
    if (existing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(existing.name);
      setDescription(existing.description ?? "");
      setPermissions(new Set(existing.permissions));
    }
  }, [existing]);

  function togglePermission(p: Permission) {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  }

  function toggleModule(moduleKey: string, checked: boolean) {
    setPermissions((prev) => {
      const next = new Set(prev);
      for (const action of PERMISSION_ACTIONS) {
        const p = `${moduleKey}.${action.key}` as Permission;
        if (checked) next.add(p);
        else next.delete(p);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (existing?.isSystem) {
      toast.error("Role sistem tidak dapat diubah.");
      return;
    }
    const body = {
      name,
      description: description || undefined,
      permissions: Array.from(permissions),
    };
    try {
      if (isEdit) {
        await updateRole(body);
        toast.success("Role berhasil diperbarui.");
      } else {
        await createRole(body);
        toast.success("Role berhasil ditambahkan.");
      }
      navigate("/settings/roles");
    } catch {
      toast.error("Gagal menyimpan role.");
    }
  }

  const isPending = creating || updating;
  const isSystem = !!existing?.isSystem;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? "Edit Role" : "Tambah Role"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Nama Role *</Label>
              <Input
                required
                disabled={isSystem}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sales, Supervisor"
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Deskripsi</Label>
              <Input
                disabled={isSystem}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat role ini"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="mb-1 text-sm font-medium">Hak Akses</p>
            <p className="mb-4 text-xs text-muted-foreground">
              Pilih modul dan tindakan yang boleh diakses role ini.
            </p>
            <Separator className="mb-4" />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr>
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Modul
                    </th>
                    {PERMISSION_ACTIONS.map((a) => (
                      <th
                        key={a.key}
                        className="pb-2 text-center font-medium text-muted-foreground"
                      >
                        {a.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_MODULES.map((m) => {
                    const modulePermissions = PERMISSION_ACTIONS.map(
                      (a) => `${m.key}.${a.key}` as Permission,
                    );
                    const allChecked = modulePermissions.every((p) =>
                      permissions.has(p),
                    );
                    return (
                      <tr key={m.key} className="border-t">
                        <td className="py-2">
                          <label className="flex items-center gap-2 font-medium">
                            <input
                              type="checkbox"
                              disabled={isSystem}
                              checked={allChecked}
                              onChange={(e) =>
                                toggleModule(m.key, e.target.checked)
                              }
                              className="h-4 w-4 rounded border-input"
                            />
                            {m.label}
                          </label>
                        </td>
                        {PERMISSION_ACTIONS.map((a) => {
                          const p = `${m.key}.${a.key}` as Permission;
                          return (
                            <td key={a.key} className="py-2 text-center">
                              <input
                                type="checkbox"
                                disabled={isSystem}
                                checked={permissions.has(p)}
                                onChange={() => togglePermission(p)}
                                className={cn("h-4 w-4 rounded border-input")}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Batal
          </Button>
          <Button type="submit" disabled={isPending || isSystem}>
            {isPending
              ? "Menyimpan..."
              : isEdit
                ? "Simpan Perubahan"
                : "Tambah Role"}
          </Button>
        </div>
      </form>
    </div>
  );
}
