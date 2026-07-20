import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { broadcastService } from "@/services/broadcast";

export function useBroadcasts() {
  return useQuery({
    queryKey: queryKeys.broadcasts.list(),
    queryFn: () => broadcastService.list(),
  });
}

export function useCreateBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: broadcastService.create,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.broadcasts.all }),
  });
}

export function useSendBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      templateId,
      recipientCount,
    }: {
      templateId: string;
      recipientCount: number;
    }) => broadcastService.send(templateId, recipientCount),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.broadcasts.all }),
  });
}

export function useBroadcastLogs(templateId?: string) {
  return useQuery({
    queryKey: [...queryKeys.broadcasts.list(), templateId],
    queryFn: () =>
      templateId ? broadcastService.getLogsByTemplateId(templateId) : [],
    enabled: !!templateId,
  });
}
