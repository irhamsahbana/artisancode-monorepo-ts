import {
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

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function BasicInfoFields({ control }: { control: Control<FormValues> }) {
  return (
    <>
      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama *</FormLabel>
              <FormControl>
                <Input placeholder="Nama key person" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jabatan</FormLabel>
            <FormControl>
              <Input placeholder="Direktur" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <FormControl>
              <Input placeholder="628xxxxxxxxxx" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="email@contoh.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Kelamin</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
