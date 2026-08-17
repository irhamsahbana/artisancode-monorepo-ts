import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useCategoryList,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import { useClientTable } from "@/hooks/use-client-table";
import type { CategoryItem } from "@/services/category";

import { CategoryDialog } from "./category-dialog";

interface Props {
  title: string;
  group: string;
}

export function MasterPage({ title, group }: Props) {
  const { data, isLoading } = useCategoryList(group);
  const { mutate: create } = useCreateCategory(group);
  const { mutate: update } = useUpdateCategory(group);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryItem | null>(null);

  const items = data?.items ?? [];
  const table = useClientTable(items, {
    searchFn: (i, q) => i.name.toLowerCase().includes(q.toLowerCase()),
  });

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: CategoryItem) {
    setEditing(item);
    setOpen(true);
  }

  function handleSave(name: string) {
    if (editing) {
      update(
        { id: editing.id, name },
        {
          onSuccess: () => {
            toast.success("Berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(name, {
        onSuccess: () => {
          toast.success("Berhasil ditambahkan.");
          setOpen(false);
        },
      });
    }
  }

  function toggleActive(item: CategoryItem) {
    update(
      { id: item.id, status: item.status === "active" ? "inactive" : "active" },
      {
        onSuccess: () =>
          toast.success(
            item.status === "active" ? "Dinonaktifkan." : "Diaktifkan.",
          ),
      },
    );
  }

  const columns: Column<CategoryItem>[] = [
    {
      key: "name",
      label: "Nama",
      render: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (i) => (
        <Badge
          variant={i.status === "active" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleActive(i)}
        >
          {i.status === "active" ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />
      <DataTable
        data={table.data}
        loadedData={table.loadedData}
        columns={columns}
        loading={isLoading}
        searchPlaceholder={`Cari ${title.toLowerCase()}...`}
        query={table.query}
        onQueryChange={table.onQueryChange}
        page={table.page}
        totalPages={table.totalPages}
        totalCount={table.totalCount}
        onPageChange={table.onPageChange}
        hasMore={table.hasMore}
        onLoadMore={table.onLoadMore}
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <CategoryDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        editing={editing}
        onSave={handleSave}
      />
    </div>
  );
}
