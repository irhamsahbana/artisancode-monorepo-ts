FROM oven/bun:1-slim
WORKDIR /app

# Layer-cache deps separately from source
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
COPY api ./api

WORKDIR /app/api
ENV NODE_ENV=production
EXPOSE 3002

# ponytail: migration runs on every start; drizzle migrate is idempotent
CMD ["sh", "-c", "bun run drizzle:migrate && bun src/index.ts"]
