import { AppError, type RestResponse } from "@artisancode/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useWhatsappLogin,
  useWhatsappLogout,
  useWhatsappReconnect,
  useWhatsappStatus,
} from "@/hooks/use-whatsapp";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError && (error.httpCode ?? 0) < 500) {
    const backendMessage = (error.data as RestResponse | undefined)?.message;
    return backendMessage || error.message;
  }
  return fallback;
}

export function WhatsappConnection() {
  const { data: status, isLoading } = useWhatsappStatus();
  const login = useWhatsappLogin();
  const logout = useWhatsappLogout();
  const reconnect = useWhatsappReconnect();
  const [secondsLeft, setSecondsLeft] = useState(0);

  async function handleLogin() {
    try {
      await login.mutateAsync();
    } catch (error) {
      toast.error(errorMessage(error, "Gagal memulai koneksi WhatsApp."));
    }
  }

  useEffect(() => {
    if (login.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSecondsLeft(login.data.qrDuration);
    }
  }, [login.data]);

  // Just ticks the countdown down — does NOT auto-refetch. Each /app/login
  // call is a real pairing attempt against WhatsApp's servers; looping it
  // unattended risks tripping WhatsApp's own anti-abuse rate limit (seen
  // firsthand: repeated rapid refreshes got "can't link new device right
  // now"). Expiry just shows a manual "Muat Ulang QR" button instead.
  useEffect(() => {
    if (secondsLeft <= 0 || status?.isLoggedIn) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, status?.isLoggedIn]);

  async function handleLogout() {
    try {
      await logout.mutateAsync();
      toast.success("WhatsApp berhasil diputuskan.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal memutuskan WhatsApp."));
    }
  }

  async function handleReconnect() {
    try {
      await reconnect.mutateAsync();
      toast.success("Mencoba menyambungkan ulang...");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menyambungkan ulang WhatsApp."));
    }
  }

  return (
    <div>
      <PageHeader
        title="Koneksi WhatsApp"
        description="Status koneksi nomor WhatsApp yang dipakai untuk mengirim pesan otomatis."
      />
      <Card>
        <CardContent className="grid gap-5 pt-6">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Memuat status...</p>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {status?.jid || "Belum terhubung"}
                </p>
              </div>
              <Badge variant={status?.isLoggedIn ? "default" : "secondary"}>
                {status?.isLoggedIn ? "Terhubung" : "Belum Terhubung"}
              </Badge>
            </div>
          )}

          {!status?.isLoggedIn && (
            <div className="grid gap-3">
              <Button onClick={handleLogin} disabled={login.isPending}>
                {login.isPending ? "Memuat QR..." : "Hubungkan WhatsApp"}
              </Button>
              {login.data && (
                <div className="flex flex-col items-center gap-2 rounded-md border p-4">
                  {login.isError ? (
                    <p className="text-xs text-destructive">Gagal memuat QR.</p>
                  ) : secondsLeft <= 0 ? (
                    <p className="text-xs text-muted-foreground">
                      QR sudah kedaluwarsa.
                    </p>
                  ) : (
                    <>
                      <img
                        src={login.data.qrLink}
                        alt="QR code WhatsApp"
                        className="h-56 w-56"
                      />
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Scan dengan aplikasi WhatsApp di HP Anda (berlaku{" "}
                        {secondsLeft} detik)
                      </p>
                    </>
                  )}
                  {(login.isError || secondsLeft <= 0) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleLogin}
                      disabled={login.isPending}
                    >
                      Muat Ulang QR
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {status?.isLoggedIn && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={handleReconnect}
                disabled={reconnect.isPending}
              >
                Sambungkan Ulang
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                disabled={logout.isPending}
              >
                Putuskan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
