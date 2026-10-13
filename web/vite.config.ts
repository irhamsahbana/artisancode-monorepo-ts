import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";

import type * as Branding from "./src/server/branding.ts";

// Dev-only parity for the two dynamic routes the production Bun server
// serves (manifest.json/favicon read live branding data) — everything else
// static (service-worker.js, splash/*, favicon.png, logo.svg) is served by Vite's
// built-in root static handling since root is "src".
function brandingDevRoutes(
  serveManifest: typeof Branding.serveManifest,
  serveFavicon: typeof Branding.serveFavicon,
): Plugin {
  return {
    name: "branding-dev-routes",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== "/manifest.json" && req.url !== "/favicon") {
          next();
          return;
        }
        const response =
          req.url === "/manifest.json"
            ? await serveManifest()
            : await serveFavicon();
        res.statusCode = response.status;
        response.headers.forEach((value: string, key: string) =>
          res.setHeader(key, value),
        );
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    },
  };
}

export default defineConfig(async ({ mode }) => {
  // Read web/.env ourselves (not import.meta.dirname/src — root is "src" below, but
  // the env file lives at the package root) instead of relying on
  // process.env already being populated: Bun's "bun run" auto-loads .env,
  // but when this is invoked indirectly (e.g. via `turbo run dev`) that
  // doesn't happen, so process.env.BUN_PUBLIC_API_URL would be empty.
  const env = loadEnv(mode, import.meta.dirname, "");

  // config/env.ts reads process.env.APP_ENV at import time, so it must be
  // set before branding.ts (which imports it) is ever loaded. A static
  // `import` at the top of this file would be hoisted above this line and
  // run too early, so branding.ts is imported dynamically here instead,
  // after process.env is populated from the loaded .env.
  process.env.APP_ENV = env.APP_ENV || process.env.APP_ENV;
  const { serveFavicon, serveManifest } = await import(
    "./src/server/branding.ts"
  );

  return {
    root: "src",
    plugins: [
      react(),
      tailwindcss(),
      brandingDevRoutes(serveManifest, serveFavicon),
    ],
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
    server: { port: parseInt(env.PORT || "9191"), host: true },
    build: {
      outDir: "../dist",
      emptyOutDir: true,
      sourcemap: true,
    },
  };
});
