FROM oven/bun:1-slim
WORKDIR /app

COPY package.json bun.lock ./
COPY api/package.json ./api/
COPY web/package.json ./web/
COPY packages/api-types/package.json ./packages/api-types/
COPY packages/http-client/package.json ./packages/http-client/
COPY packages/logger/package.json ./packages/logger/
COPY packages/logger-pino/package.json ./packages/logger-pino/
COPY packages/observability/package.json ./packages/observability/
COPY packages/resilience/package.json ./packages/resilience/
COPY packages/types/package.json ./packages/types/
RUN bun install --frozen-lockfile

COPY packages ./packages
COPY web ./web

WORKDIR /app/web
RUN bunx tailwindcss -i src/index.css -o src/tailwind-out.css --minify

ENV NODE_ENV=production
EXPOSE 3000
CMD ["bun", "src/index.ts"]
