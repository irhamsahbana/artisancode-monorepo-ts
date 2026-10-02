import { serve } from "bun";

import { env } from "@/config/env";

import index from "./index.html";

// Extension -> content-type, checked in this order. The uploaded icon lives
// on a volume shared with the api container (api writes it, this just reads).
const ICON_CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webp: "image/webp",
};

async function findCustomIconContentType(): Promise<string | null> {
  for (const [ext, contentType] of Object.entries(ICON_CONTENT_TYPE)) {
    if (await Bun.file(`${env.BRANDING_STORAGE_DIR}/icon.${ext}`).exists()) {
      return contentType;
    }
  }
  return null;
}

async function serveFavicon(): Promise<Response> {
  for (const [ext, contentType] of Object.entries(ICON_CONTENT_TYPE)) {
    const file = Bun.file(`${env.BRANDING_STORAGE_DIR}/icon.${ext}`);
    if (await file.exists()) {
      return new Response(file, { headers: { "Content-Type": contentType } });
    }
  }
  return new Response(Bun.file("./src/logo.svg"), {
    headers: { "Content-Type": "image/svg+xml" },
  });
}

// Calls the api container directly (internal Docker network) since this runs
// server-side, not in the browser. Public endpoint, no auth needed.
async function fetchBrandingName(): Promise<string> {
  try {
    const res = await fetch(
      `${env.INTERNAL_API_URL}/api/business-profile/branding`,
      { signal: AbortSignal.timeout(2000) },
    );
    if (!res.ok) return "CRM App";
    const body = (await res.json()) as { data?: { name?: string } };
    return body.data?.name || "CRM App";
  } catch {
    return "CRM App";
  }
}

async function serveManifest(): Promise<Response> {
  const [name, iconContentType] = await Promise.all([
    fetchBrandingName(),
    findCustomIconContentType(),
  ]);

  return Response.json({
    name,
    short_name: name,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#141414",
    icons: [
      {
        src: "/favicon",
        sizes: "any",
        type: iconContentType ?? "image/svg+xml",
        purpose: "any",
      },
    ],
  });
}

const server = serve({
  port: env.PORT,
  routes: {
    "/manifest.json": serveManifest,
    "/service-worker.js": () =>
      new Response(Bun.file("./src/service-worker.js")),
    "/logo.svg": () => new Response(Bun.file("./src/logo.svg")),
    "/favicon": serveFavicon,
    "/splash/:file": (req) =>
      new Response(Bun.file(`./src/splash/${req.params.file}`)),
    "/*": index,
  },

  development: !env.IS_PRODUCTION && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
