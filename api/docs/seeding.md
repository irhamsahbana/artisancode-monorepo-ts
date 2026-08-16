# Database Seeding

The project uses a seeder split by table under `api/src/db/seed/`, run with Bun. Safe to re-run — existing records are skipped by unique columns.

Each table has its own file (`business-profile.ts`, `permissions.ts`, `roles.ts`, `users.ts`, `master-items.ts`, `customers.ts`, `contacts.ts`, `products.ts`, `quotations.ts`, `ratings.ts`, `broadcasts.ts`), sharing one DB connection from `client.ts`. `index.ts` orchestrates them in order.

## Seed Order

1. **Business profile** — single row in `business_profiles` (company name, address, contact).
2. **Permissions** — 52 rows from `PERMISSION_MODULES × PERMISSION_ACTIONS` matrix in `@artisancode/api-types`. Description auto-generated as `"<Module Label>: <Action Label>"`.
3. **Role** — one `Admin` role, linked to **all** 52 permissions via `role_permissions`.
4. **Admin user** — `admin@wika.demo` / `password123` (hashed), assigned to the Admin role.
5. **Master items** — `categories` rows for groups `segmentation`, `area`, `relation_status`.
6. **Customers** — 10 demo customers matching `web/src/data/customers.ts`.
7. **Contacts** — 1–2 contacts per customer; first contact marked `isPrimary`.
8. **Products** — catalog items from `web/src/data/products.ts`.
9. **Quotations** — sample RFQs from `web/src/data/quotations.ts`.
10. **Ratings** — customer risk ratings from `web/src/data/ratings.ts`.
11. **Broadcasts** — templates + logs from `web/src/data/broadcasts.ts`.

## Run

```bash
DATABASE_URL=postgres://... bun src/db/seed/index.ts
```

Run after `bun run drizzle:migrate` on a fresh database.

## Adding New Seeds

Add a new file in `seed/`:

1. Create `seed/my-table.ts` exporting an `async function seedMyTable()` (or `upsertX()` for singletons), importing the shared `db` from `./client`.
2. Import and call it from `index.ts`'s `main()` in the correct order (respect foreign keys — e.g. seed role before user).
3. Make the step **idempotent**: look up by a unique column and skip if it exists.
