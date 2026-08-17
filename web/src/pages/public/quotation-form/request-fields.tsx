import { Combobox } from "@/components/shared/combobox";
import { CountryCodeSelect } from "@/components/shared/country-code-select";
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

export function RequestFields({
  control,
  projects,
}: {
  control: Control<FormValues>;
  projects: { id: string; name: string; location?: string }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Penawaran *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Penawaran Harga Tiang Pancang"
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
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topik Permintaan</FormLabel>
              <Combobox
                value={field.value ?? ""}
                onChange={field.onChange}
                options={[
                  { value: "Permintaan Penawaran" },
                  { value: "Request for Quotation (RFQ)" },
                  { value: "Tender/Lelang" },
                ]}
                placeholder="Pilih atau ketik topik..."
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proyek Terkait (opsional)</FormLabel>
              <Combobox
                value={field.value ?? ""}
                onChange={field.onChange}
                options={projects.map((p) => ({
                  value: p.id,
                  label: `${p.name} — ${p.location}`,
                }))}
                placeholder="Pilih proyek yang sedang berjalan..."
                enforceOptions
              />
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="requesterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap *</FormLabel>
              <FormControl>
                <Input placeholder="Nama Anda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Perusahaan (opsional)</FormLabel>
            <FormControl>
              <Input placeholder="PT / CV / UD" {...field} />
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
            <FormLabel>WhatsApp *</FormLabel>
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
                  type="tel"
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

      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (opsional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@contoh.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
