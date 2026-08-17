import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { birthdayGreetingService } from "@/services/birthday-greeting";

export function useBirthdayGreetingSettings() {
  return useQuery({
    queryKey: queryKeys.birthdayGreeting.settings(),
    queryFn: () => birthdayGreetingService.find(),
  });
}

export function useUpdateBirthdayGreetingSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: birthdayGreetingService.update,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.birthdayGreeting.all }),
  });
}

export function useBirthdayGreetingLogs() {
  return useQuery({
    queryKey: queryKeys.birthdayGreeting.logs(),
    queryFn: () => birthdayGreetingService.listLogs(),
  });
}
