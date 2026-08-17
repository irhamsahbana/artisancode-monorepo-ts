# Architecture

The project follows a **Modular Clean Architecture**.
Path: `src/modules/[module_name]/`

## Module Components

1.  **Contract** (`*.contract.ts`): Defines interfaces for Usecase and Repository.
2.  **Entity** (`src/entities/*.entity.ts`): Domain entities and DTOs.
3.  **Repository** (`*.repo.ts`): Data access layer using Drizzle ORM. Implements Repository Interface.
4.  **Usecase** (`*.usecase.ts`): Business logic layer. Implements Usecase Interface.
5.  **Handler** (`*.handler.ts`): HTTP controller layer. Handles Request/Response.
6.  **Schema** (`*.schema.ts`): Zod validation schemas.
7.  **Index** (`*.index.ts`): Wiring of dependencies and Router definition.

## Integration Layer

Third-party service integrations are separated from business logic using **Dependency Inversion**.

### Structure

```text
src/
  contracts/integration/            ← Interface contracts (provider-agnostic)
    payment.contract.ts             ← IPaymentGateway
    email.contract.ts               ← IEmailService
    storage.contract.ts             ← IStorageService
  adapter/secondary/rest/           ← Outbound REST clients (alongside repository/ and cache/)
    doku/                           ← DokuIntegration implements IPaymentGateway
    pokemon/                        ← PokemonIntegration implements IPokemonService
  integrations/                     ← Non-REST implementations (mocks, SDK-based clients)
    email/                          ← MockEmailService implements IEmailService
    storage/                        ← StorageIntegration (AWS SDK, not raw REST)
    index.ts                        ← Factory functions (createPaymentGateway, etc.)
```

### File Split Pattern

Each integration uses a **functional split** — one file per operation instead of one large class:

```text
src/adapter/secondary/rest/doku/
  index.ts              ← Thin class wrapper (delegates to standalone functions)
  client.ts             ← Config type + factory (createDokuClientConfig)
  generate-payment.ts   ← generatePaymentLink(config, req)
  check-status.ts       ← checkStatus(config, invoiceNumber)
  verify-webhook.ts     ← verifyNotificationSignature(config, headers, body, path)
  helpers.ts            ← Shared utilities (signatures, request ID, timestamp)
  types.ts              ← Provider-specific internal types
```

**Pattern**: Each function file exports a standalone async function that takes `DokuClientConfig` as its first parameter (similar to Go method receivers). The class in `index.ts` is a thin wrapper that holds the config and delegates:

```typescript
// index.ts — thin wrapper
export class DokuIntegration implements IPaymentGateway {
  private config: DokuClientConfig
  constructor() { this.config = createDokuClientConfig() }
  generatePaymentLink(req) { return generatePaymentLink(this.config, req) }
  checkStatus(invoiceNumber) { return checkStatus(this.config, invoiceNumber) }
  verifyNotificationSignature(h, b, p) { return verifyNotificationSignature(this.config, h, b, p) }
}
```

**Adding a new operation**: Create a new file (e.g. `cancel-order.ts`), export a function, add one wrapper line in `index.ts`.

### Rules

- **Usecase layer** depends only on contract interfaces (`@/contracts/integration`), never concrete implementations.
- **Module index files** call factory functions from `@/integrations` to create instances and inject them into usecases.
- **New integrations**: Add a contract in `contracts/integration/`. If it's an outbound REST client, implement it in `adapter/secondary/rest/`; otherwise (mock, SDK-based) implement it in `integrations/`. Either way, export a factory function from `integrations/index.ts`.
- **New operations**: Add a function file in the integration directory, add a wrapper method in `index.ts`.
- **Jobs** (cron scripts) also use factory functions from `@/integrations`.

## Process Split

`src/index.ts` dispatches to one of four entrypoints via `--cmd=<name>`, so each concern deploys as its own process/container:

```text
src/bin/
  app.ts        ← --cmd=server (default): the Hono REST API
  worker.ts     ← --cmd=worker: BullMQ queue consumer(s)
  scheduler.ts  ← --cmd=scheduler: in-process cron daemon (cronbake), runs recurring jobs
  cron.ts       ← --cmd=cron --task=<name>: run one named task once, then exit (external triggers)
```

- **Recurring** jobs (e.g. daily birthday greeting) belong in `src/jobs/scheduler.ts`, registered with cronbake and run by the `scheduler` process. cronbake has no timezone option — it reads the container's local time, so the process needs `TZ=Asia/Jakarta` set.
- **One-off/ad-hoc** tasks (manually triggered, not on a recurring schedule) go through `bin/cron.ts`'s task switch instead.
- Async work that shouldn't block a request (e.g. sending WhatsApp messages) is enqueued onto a **Postgres-backed BullMQ queue** — no Redis dependency. Queue setup:
  - `common/queue/*.queue.ts` — shared connection config + job data types (discriminated union when one queue serves multiple job kinds).
  - `adapter/secondary/queue/*.queue.ts` — producer (`enqueue*`), called from usecases.
  - `adapter/primary/queue/*.worker.ts` — consumer, registered in `bin/worker.ts`.
  - Use `DATABASE_URL_UNPOOLED`, not the pooled connection — BullMQ pins `search_path` via a Postgres connection startup parameter, which Neon's pgbouncer pooled endpoint rejects.
