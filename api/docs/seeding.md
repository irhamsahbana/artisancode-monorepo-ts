# Database Seeding

The project uses a single seeder script (`api/src/db/seed.ts`) run with Bun. Safe to re-run — existing records are skipped by unique columns.

## Seed Order

1. **Business profile** — single row in `business_profiles` (company name, address, contact).
2. **Permissions** — 52 rows from `PERMISSION_MODULES × PERMISSION_ACTIONS` matrix in `@artisancode/api-types`. Description auto-generated as `"<Module Label>: <Action Label>"`.
3. **Role** — one `Admin` role, linked to **all** 52 permissions via `role_permissions`.
4. **Admin user** — `admin@wika.demo` / `password123` (hashed), assigned to the Admin role.
5. **Master items** — `categories` rows for groups `customer_category`, `segmentation`, `area`, `relation_status`.
6. **Customers** — 20 fake customers (mixed `individual`/`business`), each with random master refs.
7. **Contacts** — 1–2 contacts per customer; first contact marked `isPrimary`.

## Run

```bash
DATABASE_URL=postgres://... bun src/db/seed.ts
```

Run after `bun run drizzle:migrate` on a fresh database.

## Adding New Seeds

Add a new step in `seed.ts`:

1. Write an `async function stepFoo()` next to existing helpers.
2. Call it from `main()` in the correct order (respect foreign keys — e.g. seed role before user).
3. Make the step **idempotent**: look up by a unique column and skip if it exists.
