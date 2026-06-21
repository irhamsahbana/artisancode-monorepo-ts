# Web Frontend Implementation Plan

**Status:** Complete (all phases shipped, mock data only)  
**Tech stack:** React 19 + React Router v8 + shadcn/ui + Tailwind v4 + Bun serve  
**Data:** Mock only (no API calls yet)

---

## Dependencies to Install

```bash
# Forms
bun add react-hook-form zod @hookform/resolvers

# shadcn components
bunx shadcn@latest add sidebar table dialog form select badge card input dropdown-menu pagination avatar separator sheet sonner
```

---

## File Structure

```
web/src/
├── index.ts               # Bun server (catch-all → index.html)
├── index.html
├── frontend.tsx           # RouterProvider root
├── lib/utils.ts
│
├── data/                  # Mock data
│   ├── customers.ts
│   ├── contacts.ts
│   ├── master.ts          # jenis, segmentasi, area, status relasi
│   └── dashboard.ts
│
├── components/
│   ├── ui/                # shadcn components (generated, kebab-case by default)
│   ├── layout/
│   │   ├── app-layout.tsx      # detects viewport, renders desktop or mobile layout
│   │   ├── desktop/
│   │   │   ├── sidebar.tsx     # full left sidebar
│   │   │   └── header.tsx      # top bar
│   │   └── mobile/
│   │       ├── bottom-nav.tsx  # bottom navigation bar
│   │       └── mobile-header.tsx
│   └── shared/            # page content — same for both viewports
│       ├── data-table.tsx  # reusable table: search, filter, pagination
│       ├── page-header.tsx
│       └── empty-state.tsx
│
└── pages/
    ├── login.tsx
    ├── dashboard.tsx
    ├── customers/
    │   ├── customer-list.tsx
    │   ├── customer-detail.tsx  # tabs: info, contacts, contract history
    │   └── customer-form.tsx    # shared new + edit
    ├── master/
    │   ├── customer-types.tsx   # Jenis Pelanggan
    │   ├── segmentation.tsx
    │   ├── areas.tsx
    │   └── relation-status.tsx
    ├── business-profile.tsx
    └── account-settings.tsx
```

> File names: kebab-case. Component exports inside: PascalCase. See `docs/web/naming-conventions.md`.

---

## Routes

```
/login
/                          → redirect to /dashboard
/dashboard
/customers                 # list + search + filter
/customers/new
/customers/:id
/customers/:id/edit
/master/customer-types
/master/segmentation
/master/areas
/master/relation-status
/settings/profile
/settings/account
```

`AppLayout` is a layout route wrapping everything except `/login`.

---

## Mock Data Shapes

```ts
// customers.ts
type Customer = {
  id: string
  name: string
  type: 'individual' | 'business'
  categoryId: string
  areaId: string
  status: 'prospect' | 'active' | 'inactive'
  potential: 'high' | 'medium' | 'low'
  hasContractHistory: boolean
  lastRevenue?: number
  lastContractYear?: number
  primaryContactId?: string
  whatsapp?: string
  notes?: string
  createdAt: string
}

// contacts.ts
type Contact = {
  id: string
  customerId: string
  name: string
  position?: string
  whatsapp?: string
  email?: string
  notes?: string
  isPrimary: boolean
}

// master.ts
type MasterItem = { id: string; name: string; isActive: boolean }
type MasterData = {
  customerTypes: MasterItem[]
  segmentations: MasterItem[]
  areas: MasterItem[]
  relationStatuses: MasterItem[]
}
```

---

## Implementation Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Install deps + router setup + AppLayout + Sidebar | ⬜ |
| 2 | Dashboard page + mock data files | ⬜ |
| 3 | CustomerList + reusable DataTable | ⬜ |
| 4 | CustomerDetail (tabs) + CustomerForm | ⬜ |
| 5 | 4x Master Data pages (uniform pattern) | ⬜ |
| 6 | BusinessProfile + AccountSettings | ⬜ |
| 7 | Login page | ⬜ |
