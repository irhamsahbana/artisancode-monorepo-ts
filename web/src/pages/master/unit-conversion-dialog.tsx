import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
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

import { categoryOptions } from "./uoms";
import { useUnitConversionForm } from "./use-unit-conversion-form";

import type { UnitConversion, UnitOfMeasurement } from "@artisancode/api-types";

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
  const { form, category, unitsInCategory, isSubmitting, onSubmit } =
    useUnitConversionForm(open, editing, uoms, () => onOpenChange(false));

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-sm">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {editing ? "Edit Konversi Satuan" : "Tambah Konversi Satuan"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            id="unit-conversion-form"
            onSubmit={onSubmit}
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
        <ResponsiveDialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="submit"
            form="unit-conversion-form"
            disabled={isSubmitting}
          >
            {editing ? "Simpan" : "Tambah"}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
