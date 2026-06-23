export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  PORT: parseInt(process.env.PORT ?? "9191"),
  API_BASE_URL: process.env.BUN_PUBLIC_API_URL ?? "http://localhost:3002",
};
