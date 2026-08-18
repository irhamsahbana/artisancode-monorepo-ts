# Deployment (Dokploy)

The API image (built from `api/Dockerfile`) runs as **three separate Dokploy
applications**, all from the same image/build — only the start command and
env vars differ per app. There's no per-process Dockerfile; process
selection happens at container-start time via the `--cmd` CLI flag (see
[Architecture § Process Split](architecture.md#process-split)).

| Dokploy app       | `--cmd`     | Always-on? | Exposes a port? |
| ------------------ | ----------- | ---------- | ---------------- |
| `crm-wika-api`      | `server` (default) | yes | yes — `3002`, domain-mapped |
| `crm-wika-worker`    | `worker`    | yes | no |
| `crm-wika-scheduler` | `scheduler` | yes | no |

`--cmd=cron --task=<name>` (run-once) is *not* deployed as a standing
Dokploy app — it's meant to be triggered by Dokploy's own **Schedule**
feature against this same image, for tasks that should run once and exit
rather than stay resident. Currently the only wired task is
`birthday-greeting`, which is redundant with the `scheduler` app's
`due-broadcasts`/`birthday-greeting` cronbake jobs — prefer the `scheduler`
app for anything recurring; only reach for a Dokploy Schedule + `cron.ts`
task for genuinely one-off/ad-hoc triggers.

## Start commands

The Dockerfile's default `CMD` runs migrations then boots in `server` mode:

```sh
sh -c "bun run drizzle:migrate && bun --preload ./src/otel.ts src/index.ts"
```

Only `crm-wika-api` should keep this default — it's the one place migrations
run on boot. For `worker` and `scheduler`, override Dokploy's **Custom Start
Command** to skip the migration step (avoids two processes racing
migrations) and select the mode explicitly:

```sh
# crm-wika-worker
bun --preload ./src/otel.ts src/index.ts --cmd=worker

# crm-wika-scheduler
bun --preload ./src/otel.ts src/index.ts --cmd=scheduler
```

## Environment variables per app

All three read the same `config/env.ts`, but only a subset is load-bearing
per process. Set the full set repo-wide if it's easier to manage one env
block, but the table below is what each app actually touches:

| Variable | api | worker | scheduler |
| --- | --- | --- | --- |
| `DATABASE_URL` | ✅ | ✅ | ✅ |
| `DATABASE_URL_UNPOOLED` | ✅ (enqueues jobs from request handlers) | ✅ | ✅ |
| `DB_POOL_*`, `DB_SSL_*` | ✅ | ✅ | ✅ |
| `REST_PORT`, `CORS_ORIGINS`, `CORS_ALLOW_CREDENTIALS` | ✅ | — | — |
| `JWT_*` | ✅ | — | — |
| `DOKU_*` (payment) | ✅ | — | — |
| `S3_*` | ✅ | — | — |
| `WHATSAPP_PROVIDER`, `WHATSAPP_SEND_DELAY_MIN_MS`/`MAX_MS` | — | ✅ | — |
| `GOWA_BASE_URL`, `GOWA_BASIC_AUTH`, `GOWA_DEVICE_ID` | — | ✅ | — |
| `TZ=Asia/Jakarta` | optional (log timestamps) | optional | **required** |
| `APP_*`, `OTEL_*` | ✅ | ✅ | ✅ |

Notes:

- **`DATABASE_URL_UNPOOLED` is required on all three**, not just
  worker/scheduler — BullMQ's Postgres backend pins `search_path` via a
  connection startup parameter that a pooled (pgbouncer) endpoint rejects,
  and the `server` app can enqueue jobs too (e.g. a "Kirim Sekarang" button
  hitting a REST endpoint).
- **`TZ=Asia/Jakarta` is required on `scheduler`**: cronbake has no
  timezone option, it reads the process's local time, so without this the
  `birthday-greeting` job's `@at_8:0` preset fires at 08:00 UTC (15:00 WIB)
  instead of 08:00 WIB.
- The `scheduler` app writes a cronbake state file
  (`cronbake-state.json`) relative to its working directory
  (`/app/api`, `autoRestore: true`). A restart without a persistent volume
  just re-registers the jobs from `jobs/scheduler.ts` — cron *registration*
  isn't lost, only cronbake's own run-history bookkeeping is, which isn't
  currently relied on for correctness (`due-broadcasts` re-derives "what's
  due" from the DB every tick, not from cronbake's state).
- Neither `worker` nor `scheduler` binds a port — leave Dokploy's port
  mapping/domain unset for both.

## Verifying a deploy

- **api**: `curl -I https://<domain>` → `200`; check `Server running on
  port 3002` in `application-readLogs`.
- **worker**: check logs for the worker starting without errors; a quick
  functional check is triggering any send (broadcast "Kirim Sekarang" or
  waiting for the birthday-greeting job) and confirming a `broadcast_logs`/
  send result appears.
- **scheduler**: check logs for the `Scheduler started` line — it logs the
  registered jobs and the `TZ` the process actually sees:

  ```
  Scheduler started { jobs: [{ job: 'birthday-greeting', cron: '@at_8:0' }, { job: 'due-broadcasts', cron: '@every_minute' }], tz: 'Asia/Jakarta' }
  ```

  If `tz` isn't `Asia/Jakarta`, the `TZ` env var is missing or wasn't
  applied — fix it before trusting `@at_8:0`.
