import { ProductPicker } from "@/components/projects/product-picker";
import { FormField } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function ProductsField({ control }: { control: Control<FormValues> }) {
  return (
    <div className="sm:col-span-2">
      <Separator />
      <div className="pt-6">
        <FormField
          control={control}
          name="products"
          render={({ field }) => (
            <ProductPicker value={field.value} onChange={field.onChange} />
          )}
        />
      </div>
    </div>
  );
}
