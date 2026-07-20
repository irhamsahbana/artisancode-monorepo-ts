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
import { useCreateUom, useUoms, useUpdateUom } from "@/hooks/use-uoms";

import type { UnitOfMeasurement } from "@artisancode/api-types";

export function Uoms() {
  const { data, isLoading } = useUoms();
  const { mutate: create } = useCreateUom();
  const { mutate: update } = useUpdateUom();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UnitOfMeasurement | null>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const items = data?.items ?? [];

  function openAdd() {
    setEditing(null);
    setName("");
    setSymbol("");
    setOpen(true);
  }

  function openEdit(item: UnitOfMeasurement) {
    setEditing(item);
    setName(item.name);
    setSymbol(item.symbol);
    setOpen(true);
  }

  function handleSave() {
    if (!name.trim() || !symbol.trim()) return;
    if (editing) {
      update(
        { id: editing.id, name: name.trim(), symbol: symbol.trim() },
        {
          onSuccess: () => {
            toast.success("Satuan berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(
        { name: name.trim(), symbol: symbol.trim() },
        {
          onSuccess: () => {
            toast.success("Satuan berhasil ditambahkan.");
            setOpen(false);
          },
        },
      );
    }
  }

  function toggleActive(item: UnitOfMeasurement) {
    update(
      { id: item.id, isActive: !item.isActive },
      {
        onSuccess: () =>
          toast.success(item.isActive ? "Dinonaktifkan." : "Diaktifkan."),
      },
    );
  }

  const columns: Column<UnitOfMeasurement>[] = [
    {
      key: "name",
      label: "Nama Satuan",
      render: (i) => <span className="font-medium">{i.name}</span>,
    },
    {
      key: "symbol",
      label: "Simbol",
      render: (i) => i.symbol,
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
        title="Satuan"
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
        searchPlaceholder="Cari satuan..."
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
              {editing ? "Edit Satuan" : "Tambah Satuan"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Nama Satuan</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama satuan"
                autoFocus
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Simbol</Label>
              <Input
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="kg, gram, sak, unit, dll."
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </div>
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
