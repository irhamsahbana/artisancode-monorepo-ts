import { useMutation, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { saveRefreshToken, saveToken } from "@/services/auth";
import { whatsappLoginService } from "@/services/whatsapp-login";

export function useRequestWhatsAppLogin() {
  return useMutation({ mutationFn: whatsappLoginService.request });
}

/** Polls while the user hasn't yet sent the WhatsApp confirmation; saves tokens once issued. */
export function useWhatsAppLoginStatus(id: string | null) {
  return useQuery({
    queryKey: queryKeys.whatsappLogin.status(id ?? ""),
    queryFn: async () => {
      const data = await whatsappLoginService.getStatus(id as string);
      if (data.login) {
        saveToken(data.login.token);
        saveRefreshToken(data.login.refreshToken);
      }
      return data;
    },
    enabled: !!id,
    refetchInterval: (query) =>
      query.state.data?.pending === false ? false : 3000,
  });
}
