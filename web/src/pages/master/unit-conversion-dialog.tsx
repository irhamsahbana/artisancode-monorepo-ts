import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateUnitConversion,
  useUpdateUnitConversion,
} from "@/hooks/use-unit-conversions";

import { categoryOptions } from "./uoms";

import type { UnitConversion, UnitOfMeasurement } from "@artisancode/api-types";

const schema = z
  .object({
    category: z.string().min(1, "Tipe satuan wajib dipilih"),
    fromUnitId: z.string().min(1, "Satuan asal wajib dipilih"),
    toUnitId: z.string().min(1, "Satuan tujuan wajib dipilih"),
    factor: z
      .string()
      .refine((v) => v.trim() !== "" && !Number.isNaN(Number(v)), {
        message: "Faktor wajib diisi dengan angka",
      }),
  })
  .refine((data) => data.fromUnitId !== data.toUnitId, {
    message: "Satuan asal dan satuan tujuan tidak boleh sama",
    path: ["toUnitId"],
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  category: "",
  fromUnitId: "",
  toUnitId: "",
  factor: "",
};

export function UnitConversionDialog({
  open,
  onOpenChange,
  editing,
  uoms,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: UnitConversion | null;
  uoms: UnitOfMeasurement[];
}) {
  const { mutate: create } = useCreateUnitConversion();
  const { mutate: update } = useUpdateUnitConversion();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      const fromUnit = uoms.find((u) => u.id === editing?.fromUnitId);
      form.reset(
        editing
          ? {
              category: fromUnit?.category ?? "",
              fromUnitId: editing.fromUnitId,
              toUnitId: editing.toUnitId,
              factor: String(editing.factor),
            }
          : emptyValues,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  const category = useWatch({ control: form.control, name: "category" });
  const unitsInCategory = useMemo(
    () => uoms.filter((u) => u.category === category),
    [uoms, category],
  );

  function onSubmit(values: FormValues) {
    const factor = Number(values.factor);
    if (editing) {
      update(
        {
          id: editing.id,
          fromUnitId: values.fromUnitId,
          toUnitId: values.toUnitId,
          factor,
        },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil diperbarui.");
            onOpenChange(false);
          },
        },
      );
    } else {
      create(
        { fromUnitId: values.fromUnitId, toUnitId: values.toUnitId, factor },
        {
          onSuccess: () => {
            toast.success("Konversi satuan berhasil ditambahkan.");
            onOpenChange(false);
          },
        },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Konversi Satuan" : "Tambah Konversi Satuan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="unit-conversion-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 py-2"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Satuan</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.setValue("fromUnitId", "");
                      form.setValue("toUnitId", "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe satuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Satuan</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!category}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitsInCategory.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toUnitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ke Satuan</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!category}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih satuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitsInCategory.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="factor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Faktor</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Contoh: 40" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="unit-conversion-form">
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
