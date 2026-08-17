import { Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { ProductLineFields } from "./product-line-fields";
import { newLine } from "./schema";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function ProductLinesSection({
  control,
}: {
  control: Control<FormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productLines",
  });

  return (
    <div className="grid gap-3">
      <Label>Produk yang Diminta</Label>
      {fields.map((field, index) => (
        <ProductLineFields
          key={field.id}
          control={control}
          index={index}
          onRemove={() => remove(index)}
          removable={fields.length > 1}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={() => append(newLine())}
      >
        <Plus className="h-3.5 w-3.5" />
        Tambah Produk Lain
      </Button>
    </div>
  );
}
