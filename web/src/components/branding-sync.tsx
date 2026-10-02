import { useEffect } from "react";

import { useBusinessBranding } from "@/hooks/use-business-profile";

// Mounted once at the app root (outside the router) so the tab title reflects
// the business profile's name on every page, login included.
export function BrandingSync() {
  const { data } = useBusinessBranding();

  useEffect(() => {
    document.title = data?.name || "CRM App";
  }, [data]);

  return null;
}
