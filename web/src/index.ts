import path from "node:path";

import { env } from "@/config/env";
import { serveFavicon, serveManifest } from "@/server/branding";

const DIST_DIR = path.join(import.meta.dirname, "../dist");

const server = Bun.serve({
  port: env.PORT,
  routes: {
    "/manifest.json": serveManifest,
    "/service-worker.js": () =>
      new Response(Bun.file(`${import.meta.dirname}/service-worker.js`), {
        headers: {
          "Content-Type": "application/javascript",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }),
    "/logo.svg": () =>
      new Response(Bun.file(`${import.meta.dirname}/logo.svg`)),
    "/favicon": serveFavicon,
    "/favicon.png": () =>
      new Response(Bun.file(`${import.meta.dirname}/favicon.png`), {
        headers: { "Content-Type": "image/png" },
      }),
    "/wika-beton-logo.webp": () =>
      new Response(Bun.file(`${import.meta.dirname}/wika-beton-logo.webp`), {
        headers: { "Content-Type": "image/webp" },
      }),
    "/apple-touch-icon.png": () =>
      new Response(Bun.file(`${import.meta.dirname}/apple-touch-icon.png`), {
        headers: { "Content-Type": "image/png" },
      }),
    "/splash/:file": (req) =>
      new Response(
        Bun.file(`${import.meta.dirname}/splash/${req.params.file}`),
      ),

    // Proxy API requests to backend internal service so same-origin /api/* calls work
    "/api/*": async (req) => {
      const url = new URL(req.url);
      const targetUrl = new URL(
        url.pathname + url.search,
        env.INTERNAL_API_URL,
      );
      const headers = new Headers(req.headers);
      headers.set("host", new URL(env.INTERNAL_API_URL).host);
      return fetch(targetUrl.toString(), {
        method: req.method,
        headers,
        body:
          req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
        // @ts-expect-error Bun supports duplex streaming for request bodies
        duplex: "half",
      });
    },

    // Vite build output (hashed assets + index.html), with SPA fallback for
    // client-side routes that don't correspond to a real file in dist.
    "/*": async (req) => {
      const url = new URL(req.url);
      const requested = url.pathname === "/" ? "/index.html" : url.pathname;
      const file = Bun.file(path.join(DIST_DIR, requested));
      if (await file.exists()) {
        const isHtml = requested.endsWith(".html");
        return new Response(file, {
          headers: isHtml
            ? { "Cache-Control": "no-cache, no-store, must-revalidate" }
            : { "Cache-Control": "public, max-age=31536000, immutable" },
        });
      }
      return new Response(Bun.file(path.join(DIST_DIR, "index.html")), {
        headers: { "Cache-Control": "no-cache, no-store, must-revalidate" },
      });
    },
  },
});

console.log(`🚀 Server running at ${server.url}`);
