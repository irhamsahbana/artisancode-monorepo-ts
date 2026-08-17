import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHasPermission, useMe } from "@/hooks/use-auth";
import { useRoles } from "@/hooks/use-roles";
import { useServerTable } from "@/hooks/use-server-table";
import { useDeleteUser } from "@/hooks/use-users";
import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user";

import { UserDialog } from "./user-dialog";

import type { UserAccount } from "@artisancode/api-types";

export function UserList() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserAccount | null>(null);
  const { data: rolesData } = useRoles();
  const roles = rolesData?.items ?? [];
  const { data: me } = useMe();
  const { mutate: deleteUser } = useDeleteUser();
  const canCreate = useHasPermission("users.create");
  const canUpdate = useHasPermission("users.update");
  const canDelete = useHasPermission("users.delete");

  const table = useServerTable<UserAccount>({
    queryKey: (params) => queryKeys.users.list(params),
    fetcher: (params) => userService.list(params),
    pageSize: 10,
  });

  function roleName(roleId: string) {
    return roles.find((r) => r.id === roleId)?.name ?? "-";
  }

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(user: UserAccount) {
    setEditing(user);
    setOpen(true);
  }

  function handleDelete(user: UserAccount) {
    if (!confirm(`Hapus pengguna "${user.name}"?`)) return;
    deleteUser(user.id, {
      onSuccess: () => toast.success("Pengguna berhasil dihapus."),
      onError: () => toast.error("Gagal menghapus pengguna."),
    });
  }

  const columns: Column<UserAccount>[] = [
    {
      key: "name",
      label: "Nama",
      render: (u) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{u.name}</span>
            {u.isProtected && (
              <Badge variant="outline" className="gap-1 text-[10px]">
                <Lock className="h-3 w-3" />
                Terlindungi
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{u.email}</p>
        </div>
      ),
    },
    {
      key: "username",
      label: "Username",
      render: (u) => u.username,
    },
    {
      key: "role",
      label: "Role",
      render: (u) => <Badge variant="outline">{roleName(u.roleId)}</Badge>,
    },
    {
      key: "status",
      label: "Status",
      render: (u) => (
        <Badge variant={u.status === "active" ? "default" : "outline"}>
          {u.status === "active" ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Pengguna"
        description="Kelola pengguna yang dapat mengakses sistem."
        action={
          <Button size="sm" disabled={!canCreate} onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah Pengguna
          </Button>
        }
      />
      <DataTable
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        loading={table.loading}
        searchPlaceholder="Cari pengguna..."
        query={table.query}
        onQueryChange={table.onQueryChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        actions={(user) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              disabled={!canUpdate}
              onClick={() => openEdit(user)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled={user.isProtected || user.id === me?.id || !canDelete}
              onClick={() => handleDelete(user)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      />

      <UserDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
