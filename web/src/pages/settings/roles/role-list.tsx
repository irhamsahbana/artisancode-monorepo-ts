import { PERMISSIONS } from "@artisancode/api-types";
import { Plus, Pencil, Trash2, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteRole, useRoles } from "@/hooks/use-roles";

import type { Role } from "@artisancode/api-types";

const columns: Column<Role>[] = [
  {
    key: "name",
    label: "Nama Role",
    render: (r) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{r.name}</span>
        {r.isSystem && (
          <Badge variant="outline" className="gap-1 text-[10px]">
            <Lock className="h-3 w-3" />
            Sistem
          </Badge>
        )}
      </div>
    ),
  },
  {
    key: "description",
    label: "Deskripsi",
    render: (r) => (
      <span className="text-sm text-muted-foreground">
        {r.description || "-"}
      </span>
    ),
  },
  {
    key: "permissions",
    label: "Hak Akses",
    render: (r) => (
      <Badge variant="secondary">
        {r.permissions.length}/{PERMISSIONS.length}
      </Badge>
    ),
  },
];

export function RoleList() {
  const navigate = useNavigate();
  const { data, isLoading } = useRoles();
  const { mutate: deleteRole } = useDeleteRole();

  const roles = data?.items ?? [];

  function handleDelete(role: Role) {
    if (!confirm(`Hapus role "${role.name}"?`)) return;
    deleteRole(role.id, {
      onSuccess: () => toast.success("Role berhasil dihapus."),
      onError: () => toast.error("Gagal menghapus role."),
    });
  }

  return (
    <div>
      <PageHeader
        title="Roles & Hak Akses"
        description="Kelola role pengguna dan hak akses tiap modul."
        action={
          <Button size="sm" onClick={() => navigate("/settings/roles/new")}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Role
          </Button>
        }
      />
      <DataTable
        data={roles}
        columns={columns}
        loading={isLoading}
        searchPlaceholder="Cari role..."
        searchFn={(r, q) => r.name.toLowerCase().includes(q.toLowerCase())}
        actions={(role) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/settings/roles/${role.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={role.isSystem}
              onClick={() => handleDelete(role)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
    </div>
  );
}
