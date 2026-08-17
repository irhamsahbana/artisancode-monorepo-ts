import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function NotesField({ control }: { control: Control<FormValues> }) {
  return (
    <div className="sm:col-span-2">
      <Separator />
      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem className="pt-2">
            <FormLabel>Catatan</FormLabel>
            <FormControl>
              <Textarea rows={3} placeholder="Catatan tambahan..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
