import { api } from "@/lib/api";

import type { WhatsappDevice, WhatsappLoginRes } from "@artisancode/api-types";

export const whatsappService = {
  listDevices: () => api.get<WhatsappDevice[]>("/whatsapp/devices"),
  addDevice: () => api.post<WhatsappDevice>("/whatsapp/devices", {}),
  removeDevice: (id: string) => api.del<null>(`/whatsapp/devices/${id}`),
  setPrimary: (id: string) =>
    api.post<null>(`/whatsapp/devices/${id}/primary`, {}),
  login: (id: string) =>
    api.post<WhatsappLoginRes>(`/whatsapp/devices/${id}/login`, {}),
  logout: (id: string) => api.post<null>(`/whatsapp/devices/${id}/logout`, {}),
  reconnect: (id: string) =>
    api.post<null>(`/whatsapp/devices/${id}/reconnect`, {}),
};
