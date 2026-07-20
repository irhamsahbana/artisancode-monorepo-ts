import { Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockUnitsOfMeasurement } from "@/data/uoms";
import {
  useCreateUnitConversion,
  useUnitConversions,
  useUpdateUnitConversion,
} from "@/hooks/use-unit-conversions";
import { categoryOptions } from "@/pages/master/uoms";
import { convertQuantity } from "@/services/unit-conversion";

import type {
  UnitConversion,
  UnitOfMeasurementCategory,
} from "@artisancode/api-types";
import type { ReactNode } from "react";

function unitCategory(unitId: string) {
  return mockUnitsOfMeasurement.find((u) => u.id === unitId)?.category;
}

function unitLabel(unitId: string) {
  const unit = mockUnitsOfMeasurement.find((u) => u.id === unitId);
  return unit ? `${unit.name} (${unit.symbol})` : unitId;
}

function unitSymbol(unitId: string) {
  const unit = mockUnitsOfMeasurement.find((u) => u.id === unitId);
  return unit?.symbol ?? unitId;
}

export function UnitConversions() {
  const { data, isLoading } = useUnitConversions();
  const { mutate: create } = useCreateUnitConversion();
  const { mutate: update } = useUpdateUnitConversion();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UnitConversion | null>(null);
  const [category, setCategory] = useState<UnitOfMeasurementCategory | "">("");
  const [fromUnitId, setFromUnitId] = useState("");
  const [toUnitId, setToUnitId] = useState("");
  const [factor, setFactor] = useState("");

  const unitsInCategory = useMemo(
    () => mockUnitsOfMeasurement.filter((u) => u.category === category),
    [category],
  );

  const items = useMemo(() => data?.items ?? [], [data]);

  const [calcQuantity, setCalcQuantity] = useState("1");
  const [calcFromUnitId, setCalcFromUnitId] = useState(
    mockUnitsOfMeasurement[0]?.id ?? "",
  );
  const [calcToUnitId, setCalcToUnitId] = useState(
    mockUnitsOfMeasurement[1]?.id ?? "",
  );

  const calcResult = useMemo(() => {
    const qty = Number(calcQuantity);
    if (!calcFromUnitId || !calcToUnitId || Number.isNaN(qty)) return null;
    return convertQuantity(qty, calcFromUnitId, calcToUnitId, items);
  }, [calcQuantity, calcFromUnitId, calcToUnitId, items]);

  function openAdd() {
    setEditing(null);
    setCategory("");
    setFromUnitId("");
    setToUnitId("");
    setFactor("");
    setOpen(true);
  }

  function openEdit(item: UnitConversion) {
    setEditing(item);
    setCategory(unitCategory(item.fromUnitId) ?? "");
    setFromUnitId(item.fromUnitId);
    setToUnitId(item.toUnitId);
    setFactor(String(item.factor));
    setOpen(true);
  }

  function handleCategoryChange(value: string) {
    setCategory(value as UnitOfMeasurementCategory);
    setFromUnitId("");
    setToUnitId("");
  }

  function handleSave() {
    const factorNum = Number(factor);
    if (
      !category ||
      !fromUnitId ||
      !toUnitId ||
      !factor.trim() ||
      Number.isNaN(factorNum)
    ) {
      toast.error(
        "Lengkapi tipe satuan, satuan asal, satuan tujuan, dan faktor konversi.",
      );
      return;
    }
    if (fromUnitId === toUnitId) {
      toast.error("Satuan asal dan satuan tujuan tidak boleh sama.");
      return;
    }

    if (editing) {
      update(
        { id: editing.id, fromUnitId, toUnitId, factor: factorNum },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil diperbarui.");
            setOpen(false);
          },
        },
      );
    } else {
      create(
        { fromUnitId, toUnitId, factor: factorNum },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil ditambahkan.");
            setOpen(false);
          },
        },
      );
    }
  }

  const columns: Column<UnitConversion>[] = [
    {
      key: "conversion",
      label: "Konversi",
      render: (i) => (
        <span className="font-medium">
          1 {unitLabel(i.fromUnitId)} = {i.factor} {unitLabel(i.toUnitId)}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Konversi Satuan"
        description="Kelola faktor konversi antar satuan ukur."
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
        actions={(item) => (
          <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle>Coba Konversi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Jumlah">
              <Input
                type="number"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(e.target.value)}
              />
            </Field>
            <Field label="Dari Satuan">
              <Select value={calcFromUnitId} onValueChange={setCalcFromUnitId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {mockUnitsOfMeasurement.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ke Satuan">
              <Select value={calcToUnitId} onValueChange={setCalcToUnitId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {mockUnitsOfMeasurement.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <p className="mt-4 text-sm">
            {calcResult === null ? (
              <span className="text-muted-foreground">
                Tidak ada konversi diketahui antara satuan ini.
              </span>
            ) : (
              <span className="font-medium">
                {calcQuantity} {unitSymbol(calcFromUnitId)} = {calcResult}{" "}
                {unitSymbol(calcToUnitId)}
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Konversi Satuan" : "Tambah Konversi Satuan"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Field label="Tipe Satuan">
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe satuan" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Dari Satuan">
              <Select
                value={fromUnitId}
                onValueChange={setFromUnitId}
                disabled={!category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {unitsInCategory.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ke Satuan">
              <Select
                value={toUnitId}
                onValueChange={setToUnitId}
                disabled={!category}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {unitsInCategory.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Faktor">
              <Input
                type="number"
                value={factor}
                onChange={(e) => setFactor(e.target.value)}
                placeholder="Contoh: 40"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
            </Field>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
