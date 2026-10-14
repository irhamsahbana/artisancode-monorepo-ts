import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Read web/.env ourselves (not import.meta.dirname/src — root is "src" below, but
  // the env file lives at the package root) instead of relying on
  // process.env already being populated: Bun's "bun run" auto-loads .env,
  // but when this is invoked indirectly (e.g. via `turbo run dev`) that
  // doesn't happen, so process.env.BUN_PUBLIC_API_URL would be empty.
  const env = loadEnv(mode, import.meta.dirname, "");

  return {
    root: "src",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    // Bun's bundler used to inline BUN_PUBLIC_* automatically (--env flag);
    // Vite doesn't know that convention, so inline the one var the browser
    // bundle actually reads (config/env.ts's API_BASE_URL) ourselves.
    define: {
      "process.env.BUN_PUBLIC_API_URL": JSON.stringify(
        env.BUN_PUBLIC_API_URL ?? "",
      ),
    },
    server: { port: parseInt(env.PORT || "9192"), host: true },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
