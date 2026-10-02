export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  PORT: parseInt(process.env.PORT ?? "9191"),
  API_BASE_URL: process.env.BUN_PUBLIC_API_URL ?? "http://localhost:3002",
  // Server-side only (never sent to the browser) — this process calling the
  // api container directly over the Docker network, not the browser-facing
  // BUN_PUBLIC_API_URL. Mirrors api's GOWA_BASE_URL/GOWA_PUBLIC_URL split.
  INTERNAL_API_URL: process.env.INTERNAL_API_URL ?? "http://localhost:3002",
  // Shared volume written by the api container's icon upload — read-only
  // here, same path as api's BRANDING_STORAGE_DIR.
  BRANDING_STORAGE_DIR:
    process.env.BRANDING_STORAGE_DIR ?? "./storage/branding",
};
