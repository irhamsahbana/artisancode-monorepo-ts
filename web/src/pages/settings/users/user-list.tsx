import { Plus } from "lucide-react";
import { useState } from "react";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/use-roles";
import { useServerTable } from "@/hooks/use-server-table";
import { queryKeys } from "@/lib/query-keys";
import { userService } from "@/services/user";

import { UserDialog } from "./user-dialog";

import type { UserAccount } from "@artisancode/api-types";

export function UserList() {
  const [open, setOpen] = useState(false);
  const { data: rolesData } = useRoles();
  const roles = rolesData?.items ?? [];

  const table = useServerTable<UserAccount>({
    queryKey: (params) => queryKeys.users.list(params),
    fetcher: (params) => userService.list(params),
    pageSize: 10,
  });

  function roleName(roleId: string) {
    return roles.find((r) => r.id === roleId)?.name ?? "-";
  }

  const columns: Column<UserAccount>[] = [
    {
      key: "name",
      label: "Nama",
      render: (u) => (
        <div>
          <span className="font-medium">{u.name}</span>
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
          <Button size="sm" onClick={() => setOpen(true)}>
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
      />

      <UserDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
