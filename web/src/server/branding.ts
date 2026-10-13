// Shared between the Vite dev middleware (vite.config.ts, runs under Node)
// and the production server (index.ts, runs under Bun) — plain node:fs
// instead of Bun.file so it works under either runtime.
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { env } from "../config/env.ts";

const ICON_CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  webp: "image/webp",
};

async function findCustomIcon(): Promise<{
  path: string;
  contentType: string;
} | null> {
  for (const [ext, contentType] of Object.entries(ICON_CONTENT_TYPE)) {
    const iconPath = path.join(env.BRANDING_STORAGE_DIR, `icon.${ext}`);
    try {
      await access(iconPath);
      return { path: iconPath, contentType };
    } catch {
      // try next extension
    }
  }
  return null;
}

export async function serveFavicon(): Promise<Response> {
  const custom = await findCustomIcon();
  if (custom) {
    return new Response(await readFile(custom.path), {
      headers: { "Content-Type": custom.contentType },
    });
  }
  const fallback = await readFile(
    path.join(import.meta.dirname, "../favicon.png"),
  );
  return new Response(fallback, {
    headers: { "Content-Type": "image/png" },
  });
}

async function fetchBrandingName(): Promise<string> {
  try {
    const res = await fetch(
      `${env.INTERNAL_API_URL}/api/business-profile/branding`,
      {
        signal: AbortSignal.timeout(2000),
      },
    );
    if (!res.ok) return "CRM App";
    const body = (await res.json()) as { data?: { name?: string } };
    return body.data?.name || "CRM App";
  } catch {
    return "CRM App";
  }
}

const STAGE_LABELS: Record<string, string> = {
  local: "Local",
  development: "Dev",
  staging: "Staging",
  test: "Test",
};

/** Appends a "(Dev)"-style suffix on non-production stages, so a dev/staging PWA install is distinguishable from the real one. */
function withStageSuffix(name: string): string {
  if (env.APP_ENV === "production") return name;
  const label = STAGE_LABELS[env.APP_ENV] ?? env.APP_ENV;
  return `${name} (${label})`;
}

export async function serveManifest(): Promise<Response> {
  const [brandingName, custom] = await Promise.all([
    fetchBrandingName(),
    findCustomIcon(),
  ]);
  const name = withStageSuffix(brandingName);

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
        type: custom?.contentType ?? "image/png",
        purpose: "any",
      },
    ],
  });
}
