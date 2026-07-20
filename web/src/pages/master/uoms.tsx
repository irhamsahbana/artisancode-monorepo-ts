import { Plus, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { Column, FilterOption } from "@/components/shared/data-table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateUom, useUoms, useUpdateUom } from "@/hooks/use-uoms";

import type {
  UnitOfMeasurement,
  UnitOfMeasurementCategory,
} from "@artisancode/api-types";

// ponytail: hardcoded category set (not master data) — see
// UNIT_OF_MEASUREMENT_CATEGORIES in @artisancode/api-types, the source of
// truth both this Select and any future BE schema enum validate against.
export const categoryLabel: Record<UnitOfMeasurementCategory, string> = {
  length: "Panjang",
  area: "Luas",
  volume: "Volume",
  mass: "Massa",
  time: "Waktu",
  quantity: "Jumlah",
  other: "Lainnya",
};

export const categoryOptions = Object.entries(categoryLabel).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const categoryFilters: FilterOption[] = [
  { key: "category", label: "Kategori", options: categoryOptions },
];

export function Uoms() {
  const { data, isLoading } = useUoms();
  const { mutate: create } = useCreateUom();
  const { mutate: update } = useUpdateUom();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UnitOfMeasurement | null>(null);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [category, setCategory] = useState<UnitOfMeasurementCategory | "">("");

  const items = data?.items ?? [];

  function openAdd() {
    setEditing(null);
    setName("");
    setSymbol("");
    setCategory("");
    setOpen(true);
  }

  function openEdit(item: UnitOfMeasurement) {
    setEditing(item);
    setName(item.name);
    setSymbol(item.symbol);
    setCategory(item.category);
    setOpen(true);
  }

  function handleSave() {
    if (!name.trim() || !symbol.trim() || !category) {
      toast.error("Lengkapi nama, simbol, dan kategori satuan.");
      return;
    }
    if (editing) {
      update(
        { id: editing.id, name: name.trim(), symbol: symbol.trim(), category },
        {
          onSuccess: () => {
            toast.success("Satuan berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(
        { name: name.trim(), symbol: symbol.trim(), category },
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
      key: "category",
      label: "Kategori",
      render: (i) => (
        <Badge variant="outline">{categoryLabel[i.category]}</Badge>
      ),
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
        filters={categoryFilters}
        filterFn={(i, f) => i.category === f.category}
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
            <div className="grid gap-1.5">
              <Label>Kategori</Label>
              <Select
                value={category}
                onValueChange={(v) =>
                  setCategory(v as UnitOfMeasurementCategory)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
