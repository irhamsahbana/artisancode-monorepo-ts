import { CountryCodeSelect } from "@/components/shared/country-code-select";
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

// Number + its own country code (default +62), same pattern as the key person WhatsApp field
function PhoneField({
  control,
  name,
  countryName,
  label,
  placeholder,
}: {
  control: Control<FormValues>;
  name: "phone" | "fax";
  countryName: "phoneCountryCode" | "faxCountryCode";
  label: string;
  placeholder: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <FormField
              control={control}
              name={countryName}
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
                placeholder={placeholder}
                className="flex-1"
                {...field}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

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

      <PhoneField
        control={control}
        name="phone"
        countryName="phoneCountryCode"
        label="Telepon Kantor"
        placeholder="21xxxxxxx"
      />

      <PhoneField
        control={control}
        name="fax"
        countryName="faxCountryCode"
        label="Fax"
        placeholder="21xxxxxxx"
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
