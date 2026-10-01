import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { whatsappService } from "@/services/whatsapp";

export function useWhatsappStatus() {
  return useQuery({
    queryKey: queryKeys.whatsapp.status(),
    queryFn: whatsappService.getStatus,
    refetchInterval: 5000,
  });
}

export function useWhatsappLogin() {
  return useMutation({ mutationFn: whatsappService.login });
}

export function useWhatsappLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: whatsappService.logout,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.whatsapp.status() }),
  });
}

export function useWhatsappReconnect() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: whatsappService.reconnect,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.whatsapp.status() }),
  });
}
