# Server-side pagination for DataTable

**Status:** Backlog
**Raised by:** Irham, 2026-07-24 — while reviewing the mobile card + load-more change

## Problem

`DataTable` (`web/src/components/shared/data-table/`) always receives the **entire**
dataset as a prop and does pagination/search/filter client-side via `.slice()`. Every
page fetches "all" data upfront, then just reveals more of what's already in memory
when "load more" is clicked. Fine for demo mock data (a few dozen rows), risky once
real production data grows into the hundreds/thousands — the full fetch happens on
page load regardless of pagination, not the "load more" click itself.

## Concrete bugs this causes today

1. **Some hooks don't pass `per_page` at all**: `useProjects()`, `useQuotations()`,
   and master data's `useCategoryList()` call the API with no pagination params. On
   the real (non-demo) backend this means the API's default limit (10) caps what's
   ever fetched — client-side "load more" on those pages can never reveal more than
   10 rows, because there's nothing more in memory to reveal. Only
   `useCustomers({ per_page: 100 })` and mock-only `useContactSearch("")` currently
   sidestep this (by over-fetching instead of paginating properly).
2. **Param name inconsistency**: `category` module (all Master pages) uses `limit`,
   everything else (`customer`, `project`, `quotation`) uses `per_page`. Needs
   normalizing before building a shared "load more" hook around it.
3. App currently runs with `DEMO_MODE = true` (`web/src/lib/demo-mode.ts`), so none
   of the above is visible against mock data — only shows up once wired to the real
   API/DB.

## What's already confirmed about the API

Offset-based pagination, `api/src/entities/pagination.entity.ts`:
- Request: `page`, `per_page` (or `limit` for category), plus `q` and entity filters.
- Response: `{ items: T[], pagination: { total, page, per_page, last_page } }` —
  total count included, so cursor math isn't needed, just page+1 / total comparison.

## Proposed scope

- [ ] Normalize `category` module's `limit` param to `per_page` (or handle both).
- [ ] Thread `page`/`per_page`/`q`/filters into the fetch hooks that don't have it yet
      (`useProjects`, `useQuotations`, `useCategoryList`).
- [ ] Change `DataTable` to accept server-driven pagination: `onLoadMore`,
      `hasMore`/`total`, and an external `loading`/`loadingMore` state — stop doing
      the full-array `.slice()` locally.
- [ ] Desktop pager (‹ page/total ›) also needs to trigger a real fetch per page
      instead of slicing an already-fetched array.
- [ ] Decide whether search/filter stay client-side (fine while page size is small)
      or move server-side too (needed once "load more" pages are real and filters
      should apply across the whole dataset, not just what's loaded so far).

## Why this matters

Once `DEMO_MODE` is turned off and this connects to the real DB, list pages will
silently truncate at 10 rows (Projects, Quotations, Master data) and "load more"
will do nothing past that — needs to land before/alongside the demo-to-real-API
cutover, not after.
