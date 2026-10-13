import { api } from "@/lib/api";

import type {
  BusinessProfile,
  UpdateBusinessProfileReq,
} from "@artisancode/api-types";

export const businessProfileService = {
  get: () => api.get<BusinessProfile>("/business-profile"),
  update: (payload: UpdateBusinessProfileReq) =>
    api.patch<BusinessProfile>("/business-profile", payload),
};
