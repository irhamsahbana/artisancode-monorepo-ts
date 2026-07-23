# Web Frontend — Agent Guide

## Stack

- **Runtime**: Bun (no Vite, no webpack)
- **UI**: React 19 + shadcn/ui + Tailwind v4
- **Routing**: React Router v8
- **Forms**: react-hook-form + zod
- **Icons**: lucide-react

## Quick Summary

- Entry: `src/index.ts` (Bun server) → `src/index.html` → `src/frontend.tsx` (RouterProvider)
- Path alias `@/` → `src/`
- shadcn components: `src/components/ui/` — add via `bunx shadcn@latest add <component>`
- Mock data: `src/data/` — no API calls yet

## Documentation Index

- [Layout & Viewport Strategy](docs/layout-strategy.md) — desktop/mobile split, AppLayout, Tailwind responsive class policy
- [Naming Conventions](docs/naming-conventions.md) — kebab-case files, PascalCase exports
- [Mobile & PWA Pitfalls](docs/mobile-pwa-pitfalls.md) — Bun dev-server/bundler quirks, iOS install & splash-screen requirements, pull-to-refresh gesture handling, a TS narrowing gotcha

## Implementation Plan

See [`tasks/web-frontend-plan.md`](../tasks/web-frontend-plan.md) for file structure, routes, mock data shapes, and phases.

## User Preferences

- File names: kebab-case. Component exports: PascalCase.
- No responsive Tailwind classes in viewport-specific components.
- Desktop-first (PRD requirement).
- The AI agent is authorized to update `agents.md` and `docs/` to keep them accurate.
