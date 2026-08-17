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
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";

import type { Product } from "@artisancode/api-types";

const schema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  unit: z.string().min(1, "Satuan wajib diisi"),
});

type FormValues = z.infer<typeof schema>;

export function ProductDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Product | null;
}) {
  const { mutate: create } = useCreateProduct();
  const { mutate: update } = useUpdateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", unit: "" },
  });

  useEffect(() => {
    if (open)
      form.reset({ name: editing?.name ?? "", unit: editing?.unit ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function onSubmit(values: FormValues) {
    if (editing) {
      update(
        { id: editing.id, ...values },
        {
          onSuccess: () => {
            toast.success("Produk berhasil diperbarui.");
            onOpenChange(false);
          },
        },
      );
    } else {
      create(values, {
        onSuccess: () => {
          toast.success("Produk berhasil ditambahkan.");
          onOpenChange(false);
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Produk" : "Tambah Produk"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-3 py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama produk" autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Satuan</FormLabel>
                  <FormControl>
                    <Input placeholder="m3, m2, sak, unit, dll." {...field} />
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
          <Button type="submit" form="product-form">
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
