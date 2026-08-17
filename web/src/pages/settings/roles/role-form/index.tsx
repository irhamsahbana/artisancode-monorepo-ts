import { PERMISSION_ACTIONS } from "@artisancode/api-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCreateRole, useRole, useUpdateRole } from "@/hooks/use-roles";

import { BasicFields } from "./basic-fields";
import { PermissionsSection } from "./permissions-section";
import { schema, emptyValues, type FormValues } from "./schema";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });
  const [permissions, setPermissions] = useState<Set<Permission>>(new Set());

  useEffect(() => {
    if (existing) {
      form.reset({
        name: existing.name,
        description: existing.description ?? "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPermissions(new Set(existing.permissions));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function onSubmit(values: FormValues) {
    if (existing?.isSystem) {
      toast.error("Role sistem tidak dapat diubah.");
      return;
    }
    const body = {
      name: values.name,
      description: values.description || undefined,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent className="grid grid-cols-1 gap-5 pt-6 sm:grid-cols-2">
              <BasicFields control={form.control} disabled={isSystem} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <PermissionsSection
                permissions={permissions}
                disabled={isSystem}
                onToggleModule={toggleModule}
                onTogglePermission={togglePermission}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
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
      </Form>
    </div>
  );
}
