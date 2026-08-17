import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function AudienceFilters({
  control,
  onFilterChange,
  segmentations,
  religions,
}: {
  control: Control<FormValues>;
  onFilterChange: (
    key: "gender" | "religion" | "segmentationId" | "customerStatus",
    value: string,
  ) => void;
  segmentations: { id: string; name: string }[];
  religions: string[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jenis Kelamin</FormLabel>
            <Select
              value={field.value}
              onValueChange={(v) => onFilterChange("gender", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="religion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agama</FormLabel>
            <Select
              value={field.value}
              onValueChange={(v) => onFilterChange("religion", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                {religions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="segmentationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Segmentasi Perusahaan</FormLabel>
            <Select
              value={field.value}
              onValueChange={(v) => onFilterChange("segmentationId", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                {segmentations.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="customerStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status Pelanggan</FormLabel>
            <Select
              value={field.value}
              onValueChange={(v) => onFilterChange("customerStatus", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua</SelectItem>
                <SelectItem value="prospect">Prospek</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}
