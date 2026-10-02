import { api } from "@/lib/api";

import type {
  BusinessBranding,
  BusinessProfile,
  UpdateBusinessProfileReq,
} from "@artisancode/api-types";

export const businessProfileService = {
  get: () => api.get<BusinessProfile>("/business-profile"),
  update: (payload: UpdateBusinessProfileReq) =>
    api.patch<BusinessProfile>("/business-profile", payload),
  uploadIcon: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<BusinessProfile>("/business-profile/icon", formData);
  },
  deleteIcon: () => api.del<BusinessProfile>("/business-profile/icon"),
  // Public — no auth required, used for the tab title on the login page too.
  branding: () => api.get<BusinessBranding>("/business-profile/branding"),
};
