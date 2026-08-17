import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function PersonalFields({ control }: { control: Control<FormValues> }) {
  return (
    <>
      <FormField
        control={control}
        name="birthPlace"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tempat Lahir</FormLabel>
            <FormControl>
              <Input placeholder="Makassar" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal Lahir</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agama</FormLabel>
            <FormControl>
              <Input placeholder="Islam" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pendidikan</FormLabel>
            <FormControl>
              <Input placeholder="Sarjana S-1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Alamat lengkap sesuai KTP/domisili"
                  rows={2}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
