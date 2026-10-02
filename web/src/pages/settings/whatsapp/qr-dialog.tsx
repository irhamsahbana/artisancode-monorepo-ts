import { AppError, type RestResponse } from "@artisancode/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWhatsappLogin } from "@/hooks/use-whatsapp";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError && (error.httpCode ?? 0) < 500) {
    const backendMessage = (error.data as RestResponse | undefined)?.message;
    return backendMessage || error.message;
  }
  return fallback;
}

export function WhatsappQrDialog({
  deviceId,
  isLoggedIn,
  onClose,
}: {
  deviceId: string | null;
  isLoggedIn: boolean;
  onClose: () => void;
}) {
  const login = useWhatsappLogin();
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!deviceId) return;
    login.mutate(deviceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId]);

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
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    if (deviceId && isLoggedIn) {
      toast.success("WhatsApp berhasil terhubung.");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  function handleReload() {
    if (!deviceId) return;
    login.mutate(deviceId);
  }

  return (
    <Dialog open={!!deviceId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Hubungkan WhatsApp</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-2 py-2">
          {login.isPending ? (
            <p className="text-sm text-muted-foreground">Memuat QR...</p>
          ) : login.isError ? (
            <p className="text-sm text-destructive">
              {errorMessage(login.error, "Gagal memuat QR.")}
            </p>
          ) : secondsLeft <= 0 ? (
            <p className="text-sm text-muted-foreground">
              QR sudah kedaluwarsa.
            </p>
          ) : (
            login.data && (
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
            )
          )}
          {(login.isError || secondsLeft <= 0) && !login.isPending && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReload}
            >
              Muat Ulang QR
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
