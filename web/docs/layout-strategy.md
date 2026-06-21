# Component & Layout Viewport Strategy

## Core Rule

> If a component works on both viewports → put it in the root of its folder.
> If desktop-only → put it in `desktop/`.
> If mobile-only → put it in `mobile/`.

Applies at every level: `layout/`, `shared/`, `pages/`, etc.

---

## Component Structure

```
components/
├── ui/                    # shadcn — viewport-agnostic, do not modify
│
├── layout/                # wrappers & navigation
│   ├── app-layout.tsx     # viewport detector (shared logic)
│   ├── desktop/
│   │   ├── sidebar.tsx
│   │   └── header.tsx
│   └── mobile/
│       ├── bottom-nav.tsx
│       └── mobile-header.tsx
│
├── shared/                # components used on both viewports
│   ├── data-table.tsx
│   ├── page-header.tsx
│   └── empty-state.tsx
│
├── desktop/               # non-layout components, desktop only
│   └── (e.g. stats-chart.tsx)
│
└── mobile/                # non-layout components, mobile only
    └── (e.g. swipe-actions.tsx)
```

`desktop/` and `mobile/` under `components/` start empty — add files only when a real need arises.

---

## Tailwind Responsive Classes

| Location | Responsive classes |
| --- | --- |
| `layout/desktop/*` | no |
| `layout/mobile/*` | no |
| `components/desktop/*` | no |
| `components/mobile/*` | no |
| `components/shared/*` | yes, sparingly (e.g. grid cols) |
| `pages/*` | yes, sparingly |

---

## How AppLayout Works

```tsx
// layout/app-layout.tsx
const isMobile = useMediaQuery('(max-width: 768px)')

return isMobile
  ? <MobileLayout><Outlet /></MobileLayout>
  : <DesktopLayout><Outlet /></DesktopLayout>
```

`useMediaQuery` wraps `window.matchMedia` — no extra library needed.

---

## Mobile Navigation

PRD does not specify mobile. Default plan:

- Bottom nav covers the 4 primary routes: Dashboard, Pelanggan, Master Data, Akun
- Master Data sub-routes accessible via a sheet/drawer
