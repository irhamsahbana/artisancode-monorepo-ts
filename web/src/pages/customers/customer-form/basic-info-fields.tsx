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

export function BasicInfoFields({
  control,
  segmentations,
  areas,
}: {
  control: Control<FormValues>;
  segmentations: { id: string; name: string }[];
  areas: { id: string; name: string }[];
}) {
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
                <Input placeholder="Nama pelanggan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="segmentationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Segmentasi *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih segmentasi" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {segmentations.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
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
        name="areaId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area *</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih area" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {areas.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
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
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="potential"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Potensi</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="companyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipe Perusahaan</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih tipe perusahaan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="bumn">BUMN</SelectItem>
                <SelectItem value="swasta_nasional">Swasta Nasional</SelectItem>
                <SelectItem value="swasta_asing">Swasta Asing</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
