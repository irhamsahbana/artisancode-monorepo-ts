import { api } from "@/lib/api";

import type {
  RequestWhatsAppLoginReq,
  RequestWhatsAppLoginRes,
  WhatsAppLoginStatusRes,
} from "@artisancode/api-types";

export const whatsappLoginService = {
  request: (body: RequestWhatsAppLoginReq) =>
    api.post<RequestWhatsAppLoginRes>("/auth/whatsapp-login", body),

  getStatus: (id: string) =>
    api.get<WhatsAppLoginStatusRes>(`/auth/whatsapp-login/${id}/status`),
};
