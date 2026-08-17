import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function BasicFields({
  control,
  disabled,
}: {
  control: Control<FormValues>;
  disabled: boolean;
}) {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Role *</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="Contoh: Sales, Supervisor"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Input
                disabled={disabled}
                placeholder="Deskripsi singkat role ini"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
