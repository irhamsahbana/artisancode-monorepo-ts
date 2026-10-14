export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  // Which deployment stage this is (local/development/staging/production) —
  // NODE_ENV alone can't tell, since every deployed Dokploy environment
  // (dev, staging, live) runs the same "production" build. Used only to
  // label the PWA install name so dev/staging installs are distinguishable
  // from the real one. Defaults to "production" so an unset var never adds
  // an unwanted suffix to an already-live deployment.
  APP_ENV: process.env.APP_ENV ?? "production",
  PORT: parseInt(process.env.PORT ?? "9192"),
  API_BASE_URL:
    process.env.BUN_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://api-crm-wika.artisanco.de"),
  // Server-side only (never sent to the browser) — this process calling the
  // api container directly or over the network.
  INTERNAL_API_URL:
    process.env.INTERNAL_API_URL ?? "https://api-crm-wika.artisanco.de",
};
