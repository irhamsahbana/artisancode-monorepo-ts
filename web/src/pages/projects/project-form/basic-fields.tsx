import { useWatch } from "react-hook-form";

import { LocationPicker } from "@/components/projects/location-picker";
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
import { digitsOnly, formatThousands } from "@/lib/utils";

import type { FormValues } from "./schema";
import type { Control, UseFormSetValue } from "react-hook-form";

export function BasicFields({
  control,
  setValue,
  customers,
  contacts,
  showLocationPicker,
}: {
  control: Control<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  customers: { id: string; name: string }[];
  contacts: { id: string; name: string }[];
  showLocationPicker: boolean;
}) {
  const customerId = useWatch({ control, name: "customerId" });
  const latitude = useWatch({ control, name: "latitude" });
  const longitude = useWatch({ control, name: "longitude" });

  return (
    <>
      <div className="sm:col-span-2">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Proyek *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Contoh: Pembangunan Gedung Perkantoran"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="projectNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Proyek</FormLabel>
            <FormControl>
              <Input
                placeholder="Kosongkan untuk generate otomatis"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pelanggan *</FormLabel>
            <Select
              value={field.value}
              onValueChange={(v) => {
                field.onChange(v);
                if (customerId !== v) setValue("contactId", "");
              }}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contactId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PIC Pelanggan (Key Person)</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={!customerId}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      customerId ? "Pilih kontak" : "Pilih pelanggan dulu"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {contacts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Lokasi</FormLabel>
            <FormControl>
              <Input placeholder="Kota / wilayah proyek" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {showLocationPicker && (
        <div className="sm:col-span-2">
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onChange={(lat, lng) => {
              setValue("latitude", lat);
              setValue("longitude", lng);
            }}
            onClear={() => {
              setValue("latitude", undefined);
              setValue("longitude", undefined);
            }}
          />
        </div>
      )}

      <FormField
        control={control}
        name="sourceOfFunds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sumber Dana</FormLabel>
            <FormControl>
              <Input placeholder="APBN / APBD / Swasta" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="picName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PIC (Sales)</FormLabel>
            <FormControl>
              <Input placeholder="Nama PIC internal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="prospect">Prospek</SelectItem>
                <SelectItem value="in_progress">Sedang Proses</SelectItem>
                <SelectItem value="won">Berhasil</SelectItem>
                <SelectItem value="lost">Gagal</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="estimatedValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nilai Estimasi (Rp)</FormLabel>
            <FormControl>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={formatThousands(field.value ?? "")}
                onChange={(e) => field.onChange(digitsOnly(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
