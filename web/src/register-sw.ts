import { env } from "@/config/env";

export function registerPwa() {
  if (!env.IS_PRODUCTION || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/service-worker.js");
}
