import { Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";

import type { Column } from "@/components/shared/data-table";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServerTable } from "@/hooks/use-server-table";
import { useUoms } from "@/hooks/use-uoms";
import { queryKeys } from "@/lib/query-keys";
import { convertQuantity } from "@/services/unit-conversion";
import { unitConversionService } from "@/services/unit-conversion";

import { UnitConversionDialog } from "./unit-conversion-dialog";

import type { UnitConversion } from "@artisancode/api-types";
import type { ReactNode } from "react";

export function UnitConversions() {
  const { data: uomsData } = useUoms();

  const uoms = useMemo(() => uomsData?.items ?? [], [uomsData]);

  function unitLabel(unitId: string) {
    const unit = uoms.find((u) => u.id === unitId);
    return unit ? `${unit.name} (${unit.symbol})` : unitId;
  }

  function unitSymbol(unitId: string) {
    const unit = uoms.find((u) => u.id === unitId);
    return unit?.symbol ?? unitId;
  }

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UnitConversion | null>(null);

  const table = useServerTable<UnitConversion>({
    queryKey: (params) => queryKeys.unitConversions.list(params),
    fetcher: (params) => unitConversionService.list(params),
    pageSize: 10,
  });

  const items = table.loadedItems;

  const [calcQuantity, setCalcQuantity] = useState("1");
  const [calcFromUnitId, setCalcFromUnitId] = useState("");
  const [calcToUnitId, setCalcToUnitId] = useState("");

  // Fall back to the first two loaded units until the user picks explicitly.
  const effectiveFromUnitId = calcFromUnitId || (uoms[0]?.id ?? "");
  const effectiveToUnitId = calcToUnitId || (uoms[1]?.id ?? "");

  const calcResult = useMemo(() => {
    const qty = Number(calcQuantity);
    if (!effectiveFromUnitId || !effectiveToUnitId || Number.isNaN(qty))
      return null;
    return convertQuantity(qty, effectiveFromUnitId, effectiveToUnitId, items);
  }, [calcQuantity, effectiveFromUnitId, effectiveToUnitId, items]);

  function openAdd() {
    setEditing(null);
    setOpen(true);
  }

  function openEdit(item: UnitConversion) {
    setEditing(item);
    setOpen(true);
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
        data={table.items}
        loadedData={table.loadedItems}
        columns={columns}
        loading={table.loading}
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

      <Card>
        <CardHeader>
          <CardTitle>Coba Konversi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Jumlah">
              <Input
                type="number"
                value={calcQuantity}
                onChange={(e) => setCalcQuantity(e.target.value)}
              />
            </Field>
            <Field label="Dari Satuan">
              <Select
                value={effectiveFromUnitId}
                onValueChange={setCalcFromUnitId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {uoms.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Ke Satuan">
              <Select value={effectiveToUnitId} onValueChange={setCalcToUnitId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  {uoms.map((u) => (
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
                {calcQuantity} {unitSymbol(effectiveFromUnitId)} = {calcResult}{" "}
                {unitSymbol(effectiveToUnitId)}
              </span>
            )}
          </p>
        </CardContent>
      </Card>

      <UnitConversionDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        uoms={uoms}
      />
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
