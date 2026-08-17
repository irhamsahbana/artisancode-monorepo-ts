import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import type { CategoryItem } from "@/services/category";

const schema = z.object({ name: z.string().min(1, "Nama wajib diisi") });
type FormValues = z.infer<typeof schema>;

export function CategoryDialog({
  open,
  onOpenChange,
  title,
  editing,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  editing: CategoryItem | null;
  onSave: (name: string) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (open) form.reset({ name: editing?.name ?? "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {editing ? `Edit ${title}` : `Tambah ${title}`}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="category-form"
            onSubmit={form.handleSubmit((values) => onSave(values.name))}
            className="py-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={`Nama ${title.toLowerCase()}`}
                      autoFocus
                      {...field}
                    />
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
          <Button type="submit" form="category-form">
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
