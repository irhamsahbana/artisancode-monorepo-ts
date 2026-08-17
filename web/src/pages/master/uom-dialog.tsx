import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useCreateUom, useUpdateUom } from "@/hooks/use-uoms";

import { categoryOptions } from "./uoms";

import type { UnitOfMeasurement } from "@artisancode/api-types";

const schema = z.object({
  name: z.string().min(1, "Nama satuan wajib diisi"),
  symbol: z.string().min(1, "Simbol wajib diisi"),
  category: z.enum([
    "length",
    "area",
    "volume",
    "mass",
    "time",
    "quantity",
    "other",
  ]),
});

type FormValues = z.infer<typeof schema>;

export function UomDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: UnitOfMeasurement | null;
}) {
  const { mutate: create } = useCreateUom();
  const { mutate: update } = useUpdateUom();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", symbol: "", category: "other" },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: editing?.name ?? "",
        symbol: editing?.symbol ?? "",
        category: editing?.category ?? "other",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function onSubmit(values: FormValues) {
    if (editing) {
      update(
        { id: editing.id, ...values },
        {
          onSuccess: () => {
            toast.success("Satuan berhasil diperbarui.");
            onOpenChange(false);
          },
        },
      );
    } else {
      create(values, {
        onSuccess: () => {
          toast.success("Satuan berhasil ditambahkan.");
          onOpenChange(false);
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Satuan" : "Tambah Satuan"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="uom-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Satuan</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama satuan" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Simbol</FormLabel>
                  <FormControl>
                    <Input placeholder="kg, gram, sak, unit, dll." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih kategori" />
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
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" form="uom-form">
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
