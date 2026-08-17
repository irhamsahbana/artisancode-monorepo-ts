import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function ProfilingFields({ control }: { control: Control<FormValues> }) {
  return (
    <>
      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="profiling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Profiling (hobi, karakter)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Suka golf, ramah tapi tegas soal harga..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Lain</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
