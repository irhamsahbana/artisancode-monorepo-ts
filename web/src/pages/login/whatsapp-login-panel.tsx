import { toFullPhone } from "@artisancode/phone";
import { AppError, type RestResponse } from "@artisancode/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { CountryCodeSelect } from "@/components/shared/country-code-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useRequestWhatsAppLogin,
  useWhatsAppLoginStatus,
} from "@/hooks/use-whatsapp-login";

import {
  whatsappLoginDefaultValues,
  whatsappLoginSchema,
  type WhatsappLoginValues,
} from "./whatsapp-login-schema";

import type { RequestWhatsAppLoginRes } from "@artisancode/api-types";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError && (error.httpCode ?? 0) < 500) {
    const backendMessage = (error.data as RestResponse | undefined)?.message;
    return backendMessage || error.message;
  }
  return fallback;
}

export function WhatsappLoginPanel({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestWhatsAppLoginRes | null>(null);

  const requestLogin = useRequestWhatsAppLogin();
  const { data: status } = useWhatsAppLoginStatus(request?.requestId ?? null);

  const form = useForm<WhatsappLoginValues>({
    resolver: zodResolver(whatsappLoginSchema),
    defaultValues: whatsappLoginDefaultValues,
  });

  useEffect(() => {
    if (status?.pending === false && status.login) {
      navigate("/dashboard");
    }
  }, [status, navigate]);

  async function onSubmit(values: WhatsappLoginValues) {
    try {
      const res = await requestLogin.mutateAsync({
        phone: toFullPhone(values.countryCode, values.phone),
      });
      setRequest(res);
    } catch (error) {
      toast.error(
        errorMessage(error, "Gagal memulai login WhatsApp. Coba lagi."),
      );
    }
  }

  const waLink = request
    ? `https://wa.me/${request.businessWhatsapp}?text=${encodeURIComponent(request.confirmMessage)}`
    : "";

  if (request) {
    return (
      <div className="grid gap-4 text-center">
        <h2 className="text-lg font-semibold">Satu Langkah Lagi</h2>
        <p className="text-sm text-muted-foreground">
          Untuk login, kirim pesan WhatsApp berikut dengan menekan tombol di
          bawah ini.
        </p>
        <p className="text-xs font-medium text-destructive">
          Jangan ubah isi pesannya — langsung kirim apa adanya. Pesan ini
          dipakai untuk mengidentifikasi nomor Anda.
        </p>
        <Button asChild>
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            Kirim Konfirmasi via WhatsApp
          </a>
        </Button>
        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Menunggu konfirmasi dari WhatsApp Anda...
        </p>
        <Button type="button" variant="link" onClick={onBack}>
          Kembali ke login email
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No. HP (WhatsApp)</FormLabel>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
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
        <Button
          type="submit"
          className="w-full mt-1"
          disabled={requestLogin.isPending}
        >
          {requestLogin.isPending ? "Memproses..." : "Lanjutkan"}
        </Button>
        <Button type="button" variant="link" onClick={onBack}>
          Kembali ke login email
        </Button>
      </form>
    </Form>
  );
}
