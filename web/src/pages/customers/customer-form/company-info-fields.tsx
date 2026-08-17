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

export function CompanyInfoFields({
  control,
}: {
  control: Control<FormValues>;
}) {
  return (
    <>
      <FormField
        control={control}
        name="npwp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NPWP</FormLabel>
            <FormControl>
              <Input placeholder="00.000.000.0-000.000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="skt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>SKT</FormLabel>
            <FormControl>
              <Input
                placeholder="Nomor Surat Keterangan Terdaftar"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Kantor</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="info@perusahaan.co.id"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input placeholder="https://perusahaan.co.id" {...field} />
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
                  placeholder="Alamat lengkap perusahaan"
                  rows={2}
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
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan tambahan..."
                  rows={3}
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
