# Database Seeding

The project uses a seeder split by table under `api/src/db/seed/`, run with Bun. Safe to re-run — existing records are skipped by unique columns.

Each table has its own file (`business-profile.ts`, `permissions.ts`, `roles.ts`, `users.ts`, `master-items.ts`, `areas.ts`, `products.ts`, `quotations.ts`, `broadcasts.ts`), sharing one DB connection from `client.ts`. `index.ts` orchestrates them in order.

## Seed Order

1. **Business profile** — single row in `business_profiles` (company name, address, contact).
2. **Permissions** — 52 rows from `PERMISSION_MODULES × PERMISSION_ACTIONS` matrix in `@artisancode/api-types`. Description auto-generated as `"<Module Label>: <Action Label>"`.
3. **Role** — one `Admin` role, linked to **all** 52 permissions via `role_permissions`.
4. **Users** — initial admin users (`Irham` with WA `82188449289`, `Fahri` with WA `85224377879`, and `Administrator` fallback `admin@wika.demo`), assigned to the Admin role. Passwords are random unless `SEED_PASSWORD_<USERNAME>` (e.g. `SEED_PASSWORD_FAHRI`, `SEED_PASSWORD_ADMIN`) is set in `.env`, which keeps them stable across re-seeds.
5. **Master items** — `categories` rows for groups `segmentation`, `relation_status`, `visit_topic`. Areas are not part of the demo master data: `areas.ts` adds 159 real areas normalized from the `KOTA` column of the customer list ("List pelanggan 3 tahun.xlsx").
6. **Products** — catalog items from `web/src/data/products.ts`.
7. **Quotations** — sample RFQs from `web/src/data/quotations.ts`.
8. **Broadcasts** — templates + logs from `web/src/data/broadcasts.ts`.

Customers, contacts, and ratings are no longer seeded: real customer data is loaded through the Excel import (see `scripts/convert_customer_excel.ts`).

## Run

```bash
DATABASE_URL=postgres://... bun src/db/seed/index.ts
```

Run after `bun run drizzle:migrate` on a fresh database.

`index.ts` truncates all tables first. To add only the areas to an existing database (idempotent, no truncate):

```bash
DATABASE_URL=postgres://... bun src/db/seed/areas.ts
```

## Adding New Seeds

Add a new file in `seed/`:

1. Create `seed/my-table.ts` exporting an `async function seedMyTable()` (or `upsertX()` for singletons), importing the shared `db` from `./client`.
2. Import and call it from `index.ts`'s `main()` in the correct order (respect foreign keys — e.g. seed role before user).
3. Make the step **idempotent**: look up by a unique column and skip if it exists.
