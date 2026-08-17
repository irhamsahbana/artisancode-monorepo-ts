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

export function NotesField({ control }: { control: Control<FormValues> }) {
  return (
    <FormField
      control={control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Catatan Tambahan (opsional)</FormLabel>
          <FormControl>
            <Textarea
              rows={3}
              placeholder="Lokasi proyek, jadwal kebutuhan, akses truk, dll."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
