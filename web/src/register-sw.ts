import { env } from "@/config/env";

export function registerPwa() {
  const manifestLink = document.createElement("link");
  manifestLink.rel = "manifest";
  manifestLink.href = "/manifest.json";
  document.head.appendChild(manifestLink);

  const iconLink = document.createElement("link");
  iconLink.rel = "icon";
  iconLink.href = "/favicon";
  document.head.appendChild(iconLink);

  if (!env.IS_PRODUCTION || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/service-worker.js");
}
