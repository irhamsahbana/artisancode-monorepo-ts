# Wikabeton CRM - Product Requirements Document

## User Roles

- **Super Admin**: Full system access — login, dashboard, customer data, contact management, contract history, master data, import/export, business profile, account settings.

## Core Modules

### 1. Authentication & Dashboard

- Super Admin login
- Dashboard metrics: total customers, prospects, active/inactive, customers with contract history, high-potential accounts
- Summaries by: customer status, type, category, area, potential

### 2. Customer Management (Pelanggan)

- Customer list: search, filter, sort, pagination
- CRUD: add, edit, view, archive
- Types: Individual, Business
- Bulk import (Excel) and export (Excel/CSV)

**Table columns:** name, type, category, area, status, contract history, revenue, year, primary contact, WhatsApp, potential

**Attributes:**
- Type: `individual` | `business`
- Category: Contractor, Developer, Distributor, Project Owner, Building Store
- Status: `prospect` | `active` | `inactive`
- Contract history: has history (yes/no), last revenue, last year
- Potential: `high` | `medium` | `low`
- General notes

### 3. Contact/PIC Management

- Multiple contacts per customer
- Primary contact designation
- Fields: name, position, WhatsApp, email, relationship notes

### 4. Contract History (Histori Kontrak)

- Previous contract indicator
- Last contract revenue amount
- Last contract year
- Contract description/notes

### 5. Master Data Administration

| Master | Description |
|--------|-------------|
| Jenis Pelanggan | Customer categories (Contractor, Developer, etc.) |
| Segmentasi | Customer value positioning (Key Account, Regular, Prospect, Dormant) |
| Area/Wilayah | Regional classifications |
| Status Relasi | Relationship quality (Warm, Active, Cold, Needs Follow-up) |

All master data: add, edit, deactivate (no hard delete). Inactive items hidden from new inputs but retained in historical references.

### 6. Business Profile (Profil Bisnis)

- Company/business name
- Business type
- Phone number
- Business email
- Business address

### 7. Account Settings (Pengaturan Akun)

- Name
- Login email
- Password

## Import/Export

**Import (Excel):**
- File upload → data preview → validation → error report → confirm import
- Duplicate detection
- Validations: non-empty name, valid type, valid year format, numeric revenue

**Export (Excel/CSV):**
- Full or filtered dataset export

## UI/UX Requirements

- Left sidebar navigation
- Top header bar
- Clean, minimal design — desktop-first
- Table features: search, filter, pagination, sorting, empty states, loading states
- Forms: clear labels, inline validation, save/cancel buttons
- Empty state: *"Belum ada data pelanggan. Tambahkan pelanggan baru atau import data dari Excel."*
- Error state: *"Data gagal dimuat. Silakan coba lagi."*
- Language: Bahasa Indonesia

## Navigation Structure

```
UTAMA
└── Dashboard

CRM
└── Pelanggan

MASTER DATA
├── Jenis Pelanggan
├── Segmentasi
├── Area/Wilayah
└── Status Relasi

AKUN
├── Profil Bisnis
└── Pengaturan Akun
```
