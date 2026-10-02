import { AppError, type RestResponse } from "@artisancode/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useAddWhatsappDevice,
  useRemoveWhatsappDevice,
  useSetPrimaryWhatsappDevice,
  useWhatsappDevices,
  useWhatsappLogout,
  useWhatsappReconnect,
} from "@/hooks/use-whatsapp";

import { WhatsappQrDialog } from "./qr-dialog";

import type { WhatsappDevice } from "@artisancode/api-types";

function errorMessage(error: unknown, fallback: string) {
  if (error instanceof AppError && (error.httpCode ?? 0) < 500) {
    const backendMessage = (error.data as RestResponse | undefined)?.message;
    return backendMessage || error.message;
  }
  return fallback;
}

function DeviceCard({
  device,
  logout,
  reconnect,
  setPrimary,
  remove,
  onConnect,
}: {
  device: WhatsappDevice;
  logout: ReturnType<typeof useWhatsappLogout>;
  reconnect: ReturnType<typeof useWhatsappReconnect>;
  setPrimary: ReturnType<typeof useSetPrimaryWhatsappDevice>;
  remove: ReturnType<typeof useRemoveWhatsappDevice>;
  onConnect: (deviceId: string) => void;
}) {
  async function handleLogout() {
    try {
      await logout.mutateAsync(device.id);
      toast.success("WhatsApp berhasil diputuskan.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal memutuskan WhatsApp."));
    }
  }

  async function handleReconnect() {
    try {
      await reconnect.mutateAsync(device.id);
      toast.success("Mencoba menyambungkan ulang...");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menyambungkan ulang WhatsApp."));
    }
  }

  async function handleSetPrimary() {
    try {
      await setPrimary.mutateAsync(device.id);
      toast.success("Device utama diperbarui.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menjadikan device ini utama."));
    }
  }

  async function handleRemove() {
    if (!confirm("Hapus device WhatsApp ini?")) return;
    try {
      await remove.mutateAsync(device.id);
      toast.success("Device dihapus.");
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menghapus device."));
    }
  }

  return (
    <Card>
      <CardContent className="grid gap-3 pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {device.jid || "Belum terhubung"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {device.id}
            </p>
          </div>
          {device.isPrimary && <Badge className="shrink-0">Utama</Badge>}
        </div>

        <Badge
          variant={device.isLoggedIn ? "default" : "secondary"}
          className="w-fit"
        >
          {device.isLoggedIn ? "Terhubung" : "Belum Terhubung"}
        </Badge>

        <div className="flex flex-wrap gap-2">
          {!device.isLoggedIn && (
            <Button size="sm" onClick={() => onConnect(device.id)}>
              Hubungkan
            </Button>
          )}
          {device.isLoggedIn && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReconnect}
              disabled={reconnect.isPending}
            >
              Sambungkan Ulang
            </Button>
          )}
          {device.isLoggedIn && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              Putuskan
            </Button>
          )}
          {!device.isPrimary && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSetPrimary}
              disabled={setPrimary.isPending}
            >
              Jadikan Utama
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={remove.isPending}
          >
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function WhatsappConnection() {
  const { data: devices, isLoading } = useWhatsappDevices();
  const addDevice = useAddWhatsappDevice();
  const logout = useWhatsappLogout();
  const reconnect = useWhatsappReconnect();
  const setPrimary = useSetPrimaryWhatsappDevice();
  const remove = useRemoveWhatsappDevice();

  const [qrDeviceId, setQrDeviceId] = useState<string | null>(null);
  // Set only for a device just created via "Tambah" — hidden from the grid
  // until it's actually paired, so an abandoned QR scan never leaves a
  // dangling empty row behind (cleaned up on dialog close instead).
  const [pendingNewDeviceId, setPendingNewDeviceId] = useState<string | null>(
    null,
  );

  async function handleAddDevice() {
    try {
      const device = await addDevice.mutateAsync();
      setPendingNewDeviceId(device.id);
      setQrDeviceId(device.id);
    } catch (error) {
      toast.error(errorMessage(error, "Gagal menambah device."));
    }
  }

  const activeDevice = devices?.find((d) => d.id === qrDeviceId);
  const visibleDevices = devices?.filter((d) => d.id !== pendingNewDeviceId);

  function handleCloseQr() {
    const wasAbandonedNewDevice =
      qrDeviceId &&
      qrDeviceId === pendingNewDeviceId &&
      !activeDevice?.isLoggedIn;

    if (wasAbandonedNewDevice) {
      remove.mutate(qrDeviceId);
    }
    if (qrDeviceId === pendingNewDeviceId) {
      setPendingNewDeviceId(null);
    }
    setQrDeviceId(null);
  }

  return (
    <div>
      <PageHeader
        title="Koneksi WhatsApp"
        description="Kelola nomor-nomor WhatsApp yang terhubung. Satu nomor ditandai sebagai utama untuk mengirim pesan otomatis (login, broadcast, dll)."
        action={
          <Button
            size="sm"
            onClick={handleAddDevice}
            disabled={addDevice.isPending}
          >
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat device...</p>
      ) : visibleDevices && visibleDevices.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {visibleDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              logout={logout}
              reconnect={reconnect}
              setPrimary={setPrimary}
              remove={remove}
              onConnect={setQrDeviceId}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Belum ada device WhatsApp.
        </p>
      )}

      <WhatsappQrDialog
        deviceId={qrDeviceId}
        isLoggedIn={activeDevice?.isLoggedIn ?? false}
        onClose={handleCloseQr}
      />
    </div>
  );
}
