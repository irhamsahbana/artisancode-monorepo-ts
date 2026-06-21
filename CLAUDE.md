# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

Two workspaces: `api/` (Hono REST API) and `web/` (React frontend). Both use Bun as runtime and package manager.

## Commands

All commands run from within the respective workspace directory (`api/` or `web/`).

### API (`api/`)

```bash
bun run dev              # dev server with file watching (port 3002)
bun run test             # unit tests (modules/, common/packages/, common/store/, common/middlewares/)
bun run test:integration # integration tests via Testcontainers (requires Docker)
bun test path/to/file    # run a single test file
bun run type-check       # TypeScript type checking
bun run lint:fix         # ESLint + Prettier combined fix
bun run drizzle:generate # generate migration SQL from schema changes
bun run drizzle:migrate  # apply pending migrations to DB
bun run drizzle:studio   # open Drizzle Studio UI
```

### Web (`web/`)

```bash
bun --hot src/index.ts   # dev server with HMR
bun run build            # production bundle via Bun HTML bundler
bun run lint             # ESLint
```

## After Every Change

Always run from the repo root after making any file edits:

```bash
bun format   # prettier formatting across all workspaces
bun lint:fix # ESLint + prettier fix across all workspaces
```

## Workspaces

- **API** — [`api/agents.md`](api/agents.md) for full architecture, conventions, and docs index.
- **Web** — [`web/agents.md`](web/agents.md) for stack, structure, and docs index.
- **packages/api-types** — shared request/response types (`@artisancode/api-types`). Single-tenant, no `company_id`. Import from here in both API and Web instead of defining types locally.
