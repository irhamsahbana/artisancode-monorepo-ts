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

export function FamilyFields({ control }: { control: Control<FormValues> }) {
  return (
    <>
      <FormField
        control={control}
        name="spouseName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Suami/Istri</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="spouseOccupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pekerjaan Suami/Istri</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="childrenNames"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Anak</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="childrenOccupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pekerjaan Anak</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
