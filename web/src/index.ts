import { serve } from "bun";

import { env } from "@/config/env";

import index from "./index.html";

const server = serve({
  port: env.PORT,
  routes: {
    "/manifest.json": () => new Response(Bun.file("./src/manifest.json")),
    "/service-worker.js": () =>
      new Response(Bun.file("./src/service-worker.js")),
    "/logo.svg": () => new Response(Bun.file("./src/logo.svg")),
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
