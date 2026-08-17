import { X } from "lucide-react";
import { useWatch } from "react-hook-form";

import { Combobox } from "@/components/shared/combobox";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useProducts } from "@/hooks/use-products";
import { useUoms } from "@/hooks/use-uoms";
import { digitsOnly, formatThousands } from "@/lib/utils";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function ProductLineFields({
  control,
  index,
  onRemove,
  removable,
}: {
  control: Control<FormValues>;
  index: number;
  onRemove: () => void;
  removable: boolean;
}) {
  const { data: productsData, isLoading: productsLoading } = useProducts();
  const unit = useWatch({ control, name: `productLines.${index}.unit` });
  const unitQuery = useDebouncedValue(unit);
  const { data: uomsData, isLoading: uomsLoading } = useUoms(unitQuery);

  const productOptions = (productsData?.items ?? []).map((p) => ({
    value: p.id,
    label: p.name,
    hint: p.unit,
  }));
  const unitOptions = (uomsData?.items ?? []).map((u) => ({
    value: u.symbol,
    hint: u.name,
  }));

  return (
    <div className="grid gap-3 rounded-md border p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Produk {index + 1}
        </span>
        {removable && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <FormField
        control={control}
        name={`productLines.${index}.productId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Produk (opsional)</FormLabel>
            <Combobox
              value={field.value ?? ""}
              onChange={field.onChange}
              options={productOptions}
              loading={productsLoading}
              placeholder="Ketik untuk mencari produk..."
              enforceOptions
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`productLines.${index}.specification`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spesifikasi Teknis (opsional)</FormLabel>
            <FormControl>
              <Textarea
                rows={2}
                placeholder="Kualitas beton, dimensi, standar SNI, dll."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={control}
          name={`productLines.${index}.quantity`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah / Volume (opsional)</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Contoh: 500"
                  value={formatThousands(field.value ?? "")}
                  onChange={(e) => field.onChange(digitsOnly(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`productLines.${index}.unit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satuan (opsional)</FormLabel>
              <Combobox
                value={field.value ?? ""}
                onChange={field.onChange}
                options={unitOptions}
                loading={uomsLoading}
                placeholder="Pilih dari daftar atau ketik manual"
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
