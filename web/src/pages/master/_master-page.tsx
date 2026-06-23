import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCategoryList,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-categories";
import type { CategoryItem } from "@/services/category";

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
  const [name, setName] = useState("");

  const items = data?.items ?? [];

  function openAdd() {
    setEditing(null);
    setName("");
    setOpen(true);
  }

  function openEdit(item: CategoryItem) {
    setEditing(item);
    setName(item.name);
    setOpen(true);
  }

  function handleSave() {
    if (!name.trim()) return;
    if (editing) {
      update(
        { id: editing.id, name: name.trim() },
        {
          onSuccess: () => {
            toast.success("Berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(name.trim(), {
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
        data={items}
        columns={columns}
        loading={isLoading}
        searchPlaceholder={`Cari ${title.toLowerCase()}...`}
        searchFn={(i, q) => i.name.toLowerCase().includes(q.toLowerCase())}
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${title}` : `Tambah ${title}`}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-1.5 py-2">
            <Label>Nama</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nama ${title.toLowerCase()}`}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
