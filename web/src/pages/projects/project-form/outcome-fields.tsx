import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import type { FormValues } from "./schema";
import type { Control } from "react-hook-form";

export function OutcomeFields({
  control,
  status,
}: {
  control: Control<FormValues>;
  status: FormValues["status"];
}) {
  if (status === "won") {
    return (
      <div className="sm:col-span-2">
        <Separator />
        <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Detail Berhasil
        </p>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={control}
            name="spkNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor SPK</FormLabel>
                <FormControl>
                  <Input placeholder="SPK/.../2024/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  if (status === "lost") {
    return (
      <div className="sm:col-span-2">
        <Separator />
        <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Detail Gagal
        </p>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={control}
            name="lostReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alasan Gagal</FormLabel>
                <FormControl>
                  <Input placeholder="Harga / spesifikasi / dll." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="winnerCompetitor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pesaing Pemenang</FormLabel>
                <FormControl>
                  <Input placeholder="Nama kompetitor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  return null;
}
