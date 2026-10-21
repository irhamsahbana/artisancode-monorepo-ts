import { CountryCodeSelect } from "@/components/shared/country-code-select";
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

      {/* A customer can have several important contacts */}
      <FormField
        control={control}
        name="isPrimary"
        render={({ field }) => (
          <FormItem className="flex items-center gap-2 sm:col-span-2">
            <FormControl>
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            </FormControl>
            <FormLabel className="!mt-0 font-normal">Kontak penting</FormLabel>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="whatsapp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={control}
                name="countryCode"
                render={({ field: countryField }) => (
                  <CountryCodeSelect
                    value={countryField.value}
                    onValueChange={countryField.onChange}
                  />
                )}
              />
              <FormControl>
                <Input
                  placeholder="812xxxxxxxx"
                  className="flex-1"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="landline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telepon Tetap</FormLabel>
            <div className="flex gap-2">
              <FormField
                control={control}
                name="landlineCountryCode"
                render={({ field: countryField }) => (
                  <CountryCodeSelect
                    value={countryField.value}
                    onValueChange={countryField.onChange}
                  />
                )}
              />
              <FormControl>
                <Input
                  type="tel"
                  placeholder="21xxxxxxx (kantor/rumah)"
                  className="flex-1"
                  {...field}
                />
              </FormControl>
            </div>
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
