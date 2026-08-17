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
import { Textarea } from "@/components/ui/textarea";

import { occasionLabel } from "../broadcast-status";

import type { FormValues } from "./schema";
import type { Control, UseFormWatch } from "react-hook-form";

export function TemplateFields({
  control,
  watch,
}: {
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
}) {
  const scheduleType = watch("scheduleType");

  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Template *</FormLabel>
            <FormControl>
              <Input
                placeholder="Contoh: Ucapan Selamat Hari Raya"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="occasion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occasion</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(occasionLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pesan Template *</FormLabel>
            <FormControl>
              <Textarea
                rows={4}
                placeholder="Isi pesan yang akan dikirim..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="scheduleType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Jadwal Pengiriman</FormLabel>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={field.value === "now"}
                  onChange={() => field.onChange("now")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Kirim Sekarang</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={field.value === "later"}
                  onChange={() => field.onChange("later")}
                  className="h-4 w-4"
                />
                <span className="text-sm">Jadwalkan</span>
              </label>
            </div>
          </FormItem>
        )}
      />

      {scheduleType === "later" && (
        <FormField
          control={control}
          name="scheduledAt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
