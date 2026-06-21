import { serve } from "bun";

import { env } from "@/config/env";

import index from "./index.html";

const server = serve({
  port: env.PORT,
  routes: {
    "/*": index,
  },

  development: !env.IS_PRODUCTION && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
