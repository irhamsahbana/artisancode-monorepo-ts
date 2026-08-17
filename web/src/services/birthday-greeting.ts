import { api } from "@/lib/api";

import type {
  BirthdayGreetingLog,
  BirthdayGreetingSettings,
  UpdateBirthdayGreetingSettingsReq,
} from "@artisancode/api-types";

export const birthdayGreetingService = {
  find: () => api.get<BirthdayGreetingSettings>("/birthday-greeting"),
  update: (body: UpdateBirthdayGreetingSettingsReq) =>
    api.patch<BirthdayGreetingSettings>("/birthday-greeting", body),
  listLogs: () => api.get<BirthdayGreetingLog[]>("/birthday-greeting/logs"),
};
