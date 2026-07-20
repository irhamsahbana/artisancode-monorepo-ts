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
import { useCreateProduct, useProducts, useUpdateProduct } from "@/hooks/use-products";

import type { Product } from "@artisancode/api-types";

export function Products() {
  const { data, isLoading } = useProducts();
  const { mutate: create } = useCreateProduct();
  const { mutate: update } = useUpdateProduct();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");

  const items = data?.items ?? [];

  function openAdd() {
    setEditing(null);
    setName("");
    setUnit("");
    setOpen(true);
  }

  function openEdit(item: Product) {
    setEditing(item);
    setName(item.name);
    setUnit(item.unit);
    setOpen(true);
  }

  function handleSave() {
    if (!name.trim() || !unit.trim()) return;
    if (editing) {
      update(
        { id: editing.id, name: name.trim(), unit: unit.trim() },
        {
          onSuccess: () => {
            toast.success("Produk berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(
        { name: name.trim(), unit: unit.trim() },
        {
          onSuccess: () => {
            toast.success("Produk berhasil ditambahkan.");
            setOpen(false);
          },
        },
      );
    }
  }

  function toggleActive(item: Product) {
    update(
      { id: item.id, isActive: !item.isActive },
      {
        onSuccess: () =>
          toast.success(item.isActive ? "Dinonaktifkan." : "Diaktifkan."),
      },
    );
  }

  const columns: Column<Product>[] = [
    {
      key: "name",
      label: "Nama Produk",
      render: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "unit",
      label: "Satuan",
      render: (i) => i.unit,
    },
    {
      key: "status",
      label: "Status",
      render: (i) => (
        <Badge
          variant={i.isActive ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => toggleActive(i)}
        >
          {i.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Produk"
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
        searchPlaceholder="Cari produk..."
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
            <DialogTitle>{editing ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Nama Produk</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama produk"
                autoFocus
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Satuan</Label>
              <Input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="m3, m2, sak, unit, dll."
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>{editing ? "Simpan" : "Tambah"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
