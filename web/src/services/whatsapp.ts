import { api } from "@/lib/api";

import type { WhatsappLoginRes, WhatsappStatus } from "@artisancode/api-types";

export const whatsappService = {
  getStatus: () => api.get<WhatsappStatus>("/whatsapp/status"),
  login: () => api.get<WhatsappLoginRes>("/whatsapp/login"),
  logout: () => api.post<null>("/whatsapp/logout", {}),
  reconnect: () => api.post<null>("/whatsapp/reconnect", {}),
};
