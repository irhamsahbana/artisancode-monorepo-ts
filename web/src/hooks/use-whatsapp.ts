import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { whatsappService } from "@/services/whatsapp";

export function useWhatsappDevices() {
  return useQuery({
    queryKey: queryKeys.whatsapp.devices(),
    queryFn: whatsappService.listDevices,
    refetchInterval: 5000,
  });
}

function useInvalidateDevices() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: queryKeys.whatsapp.devices() });
}

export function useAddWhatsappDevice() {
  const invalidate = useInvalidateDevices();
  return useMutation({
    mutationFn: whatsappService.addDevice,
    onSuccess: invalidate,
  });
}

export function useRemoveWhatsappDevice() {
  const invalidate = useInvalidateDevices();
  return useMutation({
    mutationFn: whatsappService.removeDevice,
    onSuccess: invalidate,
  });
}

export function useSetPrimaryWhatsappDevice() {
  const invalidate = useInvalidateDevices();
  return useMutation({
    mutationFn: whatsappService.setPrimary,
    onSuccess: invalidate,
  });
}

export function useWhatsappLogin() {
  return useMutation({ mutationFn: whatsappService.login });
}

export function useWhatsappLogout() {
  const invalidate = useInvalidateDevices();
  return useMutation({
    mutationFn: whatsappService.logout,
    onSuccess: invalidate,
  });
}

export function useWhatsappReconnect() {
  const invalidate = useInvalidateDevices();
  return useMutation({
    mutationFn: whatsappService.reconnect,
    onSuccess: invalidate,
  });
}
