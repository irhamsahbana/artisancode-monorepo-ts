# Plan — Demo UI-Only (In-Memory, No Backend)

**Tanggal:** 19 Juli 2026
**Tujuan:** Siapkan demo UI lengkap (semua fitur meeting) dalam 1–2 minggu untuk seleksi nasional KII/QCC. **Tanpa integrasi backend** — pakai data in-memory. Kode integrasi backend saat ini **di-comment**, bukan dihapus, agar gampang diaktifkan lagi nanti.
**Aturan mutlak:** semua tipe data pakai [`@artisancode/api-types`](../packages/api-types) sebagai single source of truth, di semua lapisan (mock data + service + page). Tujuannya: saat backend siap, cukup uncomment → jalan.

Sumber requirement: [meeting-summary-2026-07-19.md](meeting-summary-2026-07-19.md).

---

## 1. Arsitektur Saat Ini (seam yang akan dipakai)

```
pages/*.tsx  ──>  hooks/use-*.ts  ──>  services/*.ts  ──>  lib/api.ts  ──>  httpClient (real backend)
                                          ↑
                                   TIPE: @artisancode/api-types
```

- **Pages** (`web/src/pages/`) — konsumsi hooks. Contoh: [customer-list.tsx](../web/src/pages/customers/customer-list.tsx) pakai `useCustomers()` + `DataTable` (filter/search **sudah client-side** → cukup return list penuh dari mock).
- **Hooks** (`web/src/hooks/use-*.ts`) — react-query wrapper. **Tidak diubah.**
- **Services** (`web/src/services/*.ts`) — `customerService`, `contactService`, `categoryService`, `dashboardService`, `authService`. **Ini seam utama.** Body method saat ini panggil `api.get/post/put/del`.
- **lib/api.ts** — http-client → `env.API_BASE_URL` (real backend `localhost:3002`).
- **data/*.ts** — mock data SUDAH ada, tapi pakai **interface lokal duplikat** yang nyimpang dari api-types. Harus diperbaiki.
- **Auth** — `ProtectedRoute` + token di localStorage + `useMe()`.
- **Persistensi** — `@tanstack/react-query-persist-client` + idb (query cache di IndexedDB).

**Implikasi:** mock cukup disuntik di **services** saja. Hooks & pages tidak tersentuh. DataTable sudah filter/search sendiri → mock service cukup return list + pagination wrapper.

---

## 2. Strategi Demo Mode (rekomendasi)

**Satu seam per service, kode asli di-comment.** Di setiap `services/*.ts`, setiap method:

```ts
// services/customer.ts
import { api } from "@/lib/api";                                  // dipertahankan (untuk revert)
import { mockCustomers } from "@/data/customers";                 // data in-memory, TYPED api-types
import type { Customer, CustomerList, CreateCustomerReq, UpdateCustomerReq } from "@artisancode/api-types";

export const customerService = {
  list: async (params?: CustomerQuery): Promise<CustomerList> => {
    // === DEMO (in-memory) ===
    let items = mockCustomers;
    if (params?.q) items = items.filter((c) => c.name.toLowerCase().includes(params.q!.toLowerCase()));
    if (params?.status) items = items.filter((c) => c.status === params.status);
    if (params?.type) items = items.filter((c) => c.type === params.type);
    return { items, pagination: { page: 1, perPage: 100, total: items.length, totalPages: 1 } };
    // === PROD (uncomment untuk aktifkan backend) ===
    // return api.get<CustomerList>("/customers", params as Record<string, string>);
  },

  get: async (id: string): Promise<Customer> => {
    const c = mockCustomers.find((x) => x.id === id);
    if (!c) throw new Error("Customer not found");
    return c;
    // return api.get<Customer>(`/customers/${id}`);
  },

  create: async (body: CreateCustomerReq): Promise<Customer> => {
    const c: Customer = { ...body, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Customer;
    mockCustomers.push(c);
    return c;
    // return api.post<Customer>("/customers", toSnakeBody(body));
  },
  // update, delete: pola sama — mutasi mockCustomers, return; baris api.* di-comment.
};
```

**Kenapa bukan satu `mock-api.ts` router global?** Router-by-path duplikasi pengetahuan endpoint & rapuh. Inline per-service lebih eksplisit, mock logic tinggal di sebelah real call, dan revert = uncomment 1 baris + hapus return mock. DataTable sudah handle filter client-side, jadi mock service pendek.

**Auth bypass (demo):** di `services/auth.ts`, comment real call, return session palsu:
```ts
export const login = async (_body: LoginReq): Promise<LoginRes> => {
  // DEMO
  return { token: "demo-token", user: { id: "u1", email: "admin@wikabeton.id", name: "Super Admin", role: "super_admin", createdAt: new Date().toISOString() } } as LoginRes;
  // return api.post<LoginRes>("/auth/login", body);
};
export const getMe = async (): Promise<User> => { /* return user palsu sama */ };
```
Token palsu tersimpan via `saveToken` yang sudah ada → `ProtectedRoute` & `useMe` jalan tanpa diubah. Login page tetap tampil (boleh pre-fill / auto-submit opsional).

**Latensi simulasi (opsional, biar realistis):** bungkus return dengan `await new Promise(r => setTimeout(r, 300))`. Skip jika demo terasa lambat.

---

## 3. Fase 0 — Fondasi Demo Mode (hari 1)

Tujuan: semua yang sudah ada jalan dengan mock, sebelum bangun fitur baru.

| # | File | Aksi |
|---|------|------|
| 0.1 | `web/src/data/customers.ts` | Hapus interface `Customer` lokal. `import type { Customer } from "@artisancode/api-types"`. Rename export `customers` → `mockCustomers`. Samakan field gender jadi `'male'\|'female'`, isi `updatedAt`. |
| 0.2 | `web/src/data/contacts.ts` `dashboard.ts` `master.ts` | Sama: ganti interface lokal → import dari api-types, rename ke `mock*`. |
| 0.3 | `web/src/services/*.ts` (5 file) | Terapkan pola §2: comment real call, return mock. Import tipe dari api-types. |
| 0.4 | `web/src/services/auth.ts` | Auth bypass session palsu (§2). |
| 0.5 | Verifikasi | `bun --hot src/index.ts` → login → dashboard → customer list/form/detail → master → settings semua jalan dari mock. |

**Definition of Done Fase 0:** app berjalan full tanpa backend nyala. Semua halaman existing fungsional dari in-memory.

---

## 4. Fase 1–6 — Fitur Baru (sisa 1–2 minggu)

Urutan = prioritas meeting. Chat Blast & Mapping terakhir (opsional kalau sempat). **Setiap fitur:** (a) tambah tipe di api-types → (b) tambah mock data → (c) tambah service stub → (d) tambah hook → (e) tambah page + route + nav.

### Fase 1 — Daftar Pelanggan (perbaiki struktur perusahaan → key person)

**Status:** sudah ada list/form/detail, tapi flat. Perlu hierarki & many-to-many.

**api-types — ubah `contact.ts`:** saat ini `Contact.customerId` 1:1. Untuk dukung "pinjam perusahaan" (1 orang di banyak perusahaan), pilih pendekatan:

- *Demo (cukup):* tetap `Contact` per-customer, tapi search-by-person agregasi lintas contact by `name`/`whatsapp`. Mock query `GET /contacts/search?q=` return list contact + customer-nya.
- *Proper (backend nanti):* pisah entitas `Person` (master) + `Contact` sebagai join `personId ↔ customerId`. Tandai sebagai catatan backend.

```ts
// packages/api-types/src/contact.ts — tambahan untuk demo search
export interface ContactSearchResult {
  contact: Contact;
  customer: Customer;   // perusahaan tempat dia nongol
}
export interface GetContactReq { q?: string; customerId?: string; isPrimary?: boolean }
export interface ContactList { items: Contact[]; pagination: PaginationMetadata }
```

**Perubahan UI:**
- Tambah toggle view di `customer-list.tsx`: **"Perusahaan"** vs **"Key Person"**.
- Mode Key Person: tabel/list orang, search by nama → klik → modal/halaman profil + daftar perusahaan terkait.
- `customer-detail.tsx`: section "Key Persons" (list contact, tambah/edit/jadikan primary).

**Files:** `pages/customers/contact-*` (baru), `services/contact.ts` (extend search), `hooks/use-contacts.ts` (extend).

---

### Fase 2 — Monitoring Proyek (baru)

**api-types — file baru `project.ts`:**
```ts
export type ProjectStatus = 'prospect' | 'in_progress' | 'won' | 'lost'

export interface Project {
  id: string
  customerId: string          // link Daftar Pelanggan
  contactId?: string          // key person
  name: string                // nama proyek
  location?: string
  latitude?: number           // untuk Mapping (Fase 6)
  longitude?: number
  sourceOfFunds?: string      // sumber dana
  picName?: string            // sales PIC internal
  status: ProjectStatus
  estimatedValue?: number     // omset/onset
  spkNumber?: string          // jika won
  lostReason?: string         // jika lost
  winnerCompetitor?: string   // pesaing yang menang
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectVisit {           // log kunjungan/follow-up
  id: string
  projectId: string
  visitDate: string
  metWith?: string
  topic?: string
  notes?: string
  createdAt: string
}

export interface ProjectList { items: Project[]; pagination: PaginationMetadata }
export interface CreateProjectReq { /* subset Project tanpa id/timestamps */ }
export interface UpdateProjectReq { /* partial */ }
```
Export dari `packages/api-types/src/index.ts`.

**UI:**
- `pages/projects/project-list.tsx` — tabel proyek, filter status (kanban opsional), kolom: nama, pelanggan, lokasi, status, nilai.
- `pages/projects/project-form.tsx` — CRUD. Saat status = `won` → muncul field omset + SPK. Saat `lost` → field alasan + pesaing.
- `pages/projects/project-detail.tsx` — info + tab **Kunjungan** (list `ProjectVisit`, tambah log follow-up).
- Link nama pelanggan → auto-terisi dari `mockCustomers` (dropdown).

---

### Fase 3 — Penilaian Pelanggan (baru)

**api-types — file baru `rating.ts`:**
```ts
export interface CustomerRating {
  id: string
  customerId: string
  ratingDate: string
  paymentScore: number        // 1-5 (cara bayar)
  relationshipScore: number   // 1-5
  problemNotes?: string       // bermasalah/tdk
  riskLevel: 'low' | 'medium' | 'high'
  notes?: string
  createdAt: string
  updatedAt: string
}
export interface CustomerRatingList { items: CustomerRating[]; pagination: PaginationMetadata }
export interface CreateCustomerRatingReq { /* subset */ }
```

**UI:** `pages/ratings/rating-list.tsx` (per pelanggan) + form penilaian. Tampil skor rata-rata per pelanggan. Dikaitkan ke pelanggan yang berkontrak (filter `hasContractHistory: true`).

> CSI (pelanggan menilai kita) = **out of scope demo**, next stage. Hanya placeholder menu "Coming soon".

---

### Fase 4 — Permintaan Penawaran / RFQ (form public, baru)

**api-types — file baru `quotation.ts`:**
```ts
export type QuotationStatus = 'new' | 'in_review' | 'responded'
export interface QuotationRequest {
  id: string
  requesterName: string
  companyName?: string
  whatsapp: string
  email?: string
  productName?: string
  specification?: string
  quantity?: string
  notes?: string
  status: QuotationStatus
  createdAt: string
}
export interface CreateQuotationReq { /* subset tanpa id/status/timestamps */ }
export interface QuotationList { items: QuotationRequest[]; pagination: PaginationMetadata }
```

**UI:**
- `pages/public/quotation-form.tsx` — form mandiri (akses public via link, mis. route `/rfq`). Style bersih, mirip Google Form. Submit → toast sukses + reset.
- `pages/quotations/quotation-list.tsx` (internal) — inbox permintaan, ubah status, tombol "Kirim penawaran via WA" (link `wa.me`).
- Notifikasi: mock — tambah ke list + toast di internal. (Real WA notif = integrasi Fase integrasi.)

**Catatan:** untuk demo, form RFQ tidak perlu route terpisah ter-protect; bisa diakses tanpa login. Tandai untuk dibahas di tahap integrasi (app public vs internal terpisah).

---

### Fase 5 — Chat Blast / Broadcast WA (UI only, terakhir)

**api-types — file baru `broadcast.ts`:**
```ts
export type BroadcastOccasion = 'idul_fitri' | 'christmas' | 'new_year' | 'national_day' | 'thank_you' | 'custom'
export interface BroadcastTemplate {
  id: string
  name: string
  message: string
  occasion: BroadcastOccasion
  audienceSegmentationId?: string
  audienceStatus?: CustomerStatus
  createdAt: string
}
export interface BroadcastLog {
  id: string
  templateId: string
  sentAt: string
  recipientCount: number
  status: 'pending' | 'sent' | 'failed'
}
```

**UI:** `pages/broadcast/broadcast-list.tsx` (template + composer) → pilih segmen → preview daftar penerima (filter `mockCustomers`) → tombol "Kirim" (mock: catat `BroadcastLog`, toast "X pesan dijadwalkan"). Tidak benar-benar kirim WA.

---

### Fase 6 — Dashboard Reminder + Mapping (tambahan)

**api-types — extend `dashboard.ts`:**
```ts
export interface DashboardReminder {
  type: 'birthday' | 'religious_holiday' | 'national_day'
  date: string                 // ISO
  title: string
  relatedContactId?: string
  relatedCustomerId?: string
}
// extend DashboardMetrics dengan reminders: DashboardReminder[] + projectStatusSummary, dll.
```

**Reminder:** derive dari `mockContacts` (tanggal lahir) + tabel hari nasional/keagamaan statis (mock `data/holidays.ts`). Tampil kartu "Hari ini / Besok" di dashboard.

**Mapping:** opsional. Pakai **OpenStreetMap** (gratis, `leaflet` + `react-leaflet`). Pin lokasi kantor pelanggan (dari `Customer.address`/lat-lng mock) + lokasi proyek (`Project.latitude/longitude`). Kalau sempat; kalau tidak, placeholder "Peta lokasi" dengan screenshot.

---

## 5. Timeline (1–2 minggu)

| Minggu | Fase | Output |
|--------|------|--------|
| **W1 D1** | Fase 0 | App jalan full mock, semua halaman existing OK. |
| **W1 D2–3** | Fase 1 | Pelanggan: view perusahaan/person, search key person, detail key persons. |
| **W1 D4–5** | Fase 2 | Monitoring Proyek: list + form (status won/lost) + log kunjungan. |
| **W1 D6–W2 D1** | Fase 3 + 4 | Penilaian Pelanggan + RFQ (public form + inbox). |
| **W2 D2–3** | Fase 5 | Chat Blast UI (template + preview + mock kirim). |
| **W2 D4** | Fase 6 | Dashboard reminder + (mapping kalau sempat). |
| **W2 D5** | Polish | Empty/loading state, tema, PWA install, demo flow walkthrough. |

---

## 6. Cara Kembali ke Backend Asli (saat lolos & integrasi)

Karena mock disuntik hanya di **services** dengan kode asli di-comment, revert per fitur:

1. Buka `services/<entity>.ts`.
2. Uncomment baris `return api.<method>(...)`.
3. Hapus/mock return demo.
4. Pastikan backend endpoint + skema match api-types (api-types sudah jadi kontrak).
5. Selesai — hooks & pages tidak tersentuh.

**Checklist revert per service:** auth, customer, contact, project, rating, quotation, broadcast, dashboard, category(master).

**Prasyarat integrasi penuh (bukan demo):** VPN/Tailscale, region server ID, WA Bisnis (Meta), Google Maps/OSM tiles, ETL data Excel existing (lihat [meeting-summary §Tantangan Data](meeting-summary-2026-07-19.md)).

---

## 7. Out of Scope Demo

- Integrasi WA Bisnis / Meta (Chat Blast = UI mock saja).
- Notifikasi WA nyata dari RFQ.
- CSI / Customer Satisfaction Index (next stage).
- Import/Export Excel (bisa pakai data mock; import real = tahap integrasi).
- Auth real / multi-user / permission.
- Pemetaan normalisasi Person↔Company proper (demo pakai agregasi search).

## 8. Risiko

- **Bottleneck waktu = data Excel existing** (unstructured, redundan). Demo **tidak** pakai itu — pakai mock data bersih. Data real = tahap integrasi (ETL).
- **Contact many-to-many** perlu keputusan modeling (§Fase 1). Demo ambil jalan agregasi; backend proper = `Person` entity.
- **api-types jadi kontrak** — kalau field mock nyimpang dari api-types, swap bakal rusak. Disiplin: mock data WAJIB `satisfies`/bertipe api-types.

---

## 9. Catatan Implementasi

- File baru ikut konvensi [web/agents.md](../web/agents.md): kebab-case filename, PascalCase export, komponen `src/components/ui/` via shadcn.
- Mock data `satisfies` tipe api-types biar drift terdeteksi saat compile:
  ```ts
  export const mockCustomers: Customer[] = [ ... ];
  ```
- Tidak responsive Tailwind di komponen viewport-specific; desktop-first (PRD).
- Setelah demo siap: jalankan `bun format` + `bun lint:fix` dari repo root.
