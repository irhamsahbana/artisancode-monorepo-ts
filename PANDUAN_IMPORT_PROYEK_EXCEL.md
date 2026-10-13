# PANDUAN OPERASIONAL PENGGUNA (SOP)
## Fitur Impor Massal Data Proyek & Kebutuhan Produk (Excel .xlsx)
**Sistem CRM PT Wijaya Karya (Persero) Tbk — Versi 1.0 (Oktober 2026)**

---

### Daftar Isi
1. [Tujuan & Gambaran Umum](#1-tujuan--gambaran-umum)
2. [Alur 5 Langkah Cepat](#2-alur-5-langkah-cepat)
3. [Struktur Lembar Kerja (Worksheet) Excel](#3-struktur-lembar-kerja-worksheet-excel)
4. [Spesifikasi Kolom Data Lengkap](#4-spesifikasi-kolom-data-lengkap)
   - [A. Sheet "Data Proyek"](#a-sheet-data-proyek)
   - [B. Sheet "Kebutuhan Produk Proyek"](#b-sheet-kebutuhan-produk-proyek)
   - [C. Sheet "Panduan & Master Data"](#c-sheet-panduan--master-data)
5. [Pilihan Mode Impor: Skip vs Upsert](#5-pilihan-mode-impor-skip-vs-upsert)
6. [Panduan Visual Langkah Demi Langkah](#6-panduan-visual-langkah-demi-langkah)
7. [Tips & Penanganan Masalah (Troubleshooting)](#7-tips--penanganan-masalah-troubleshooting)

---

### 1. Tujuan & Gambaran Umum
Fitur **Import Data Proyek & Kebutuhan Produk (Excel)** dirancang untuk mempermudah tim Sales, Operasional, dan Manajemen PT Wijaya Karya dalam memasukkan data puluhan hingga ratusan proyek baru beserta kebutuhan material/produknya ke dalam database CRM secara instan dan bebas repot.

Fitur ini dilengkapi dengan:
- **Validasi Cerdas (Dry-Run)**: Memeriksa integritas berkas, relasi data pelanggan, dan katalog produk sebelum ada data yang disimpan.
- **Dukungan Kebutuhan Produk Multi-Item**: Satu proyek dapat memiliki banyak kebutuhan produk material (beton, besi, semen, paving, dll).
- **Mode Eksekusi Fleksibel**: Pilihan untuk melewati proyek lama (*Skip*) atau memperbarui data proyek yang sudah ada (*Upsert*).

---

### 2. Alur 5 Langkah Cepat

```
[1. Buka Menu] ➔ [2. Unduh Template] ➔ [3. Isi Data] ➔ [4. Validasi Otomatis] ➔ [5. Pilih Mode & Impor]
```

1. **Buka Menu**: Masuk ke menu **Monitoring Proyek** di CRM Wika.
2. **Unduh Template**: Klik tombol **"Import Excel"** lalu unduh template resmi format `.xlsx`.
3. **Isi Data**: Isi Sheet *Data Proyek* dan Sheet *Kebutuhan Produk Proyek*.
4. **Validasi Otomatis**: Unggah berkas ke dropzone untuk pratinjau instan (*dry-run*).
5. **Pilih Mode & Impor**: Pilih mode **Lewati (Skip)** atau **Perbarui (Upsert)**, lalu klik **"Mulai Impor Proyek"**.

---

### 3. Struktur Lembar Kerja (Worksheet) Excel
Template Excel resmi terdiri dari **3 Lembar Kerja (Sheet)**:

| Sheet | Nama Sheet | Fungsi & Deskripsi |
| :--- | :--- | :--- |
| **Sheet 1** | **Data Proyek** | Memuat informasi utama proyek konstruksi, nomor proyek, relasi ke pelanggan, estimasi nilai, lokasi, dan status follow-up. |
| **Sheet 2** | **Kebutuhan Produk Proyek** | Memuat daftar volume material/produk yang dibutuhkan proyek, dihubungkan via Nomor Proyek atau Nama Proyek. |
| **Sheet 3** | **Panduan & Master Data** | Kamus referensi otomatis dari database: daftar nama pelanggan aktif, daftar produk & satuan, serta status yang valid. |

---

### 4. Spesifikasi Kolom Data Lengkap

#### A. Sheet "Data Proyek"
| Nama Kolom | Sifat | Contoh Nilai | Keterangan & Validasi |
| :--- | :---: | :--- | :--- |
| **Nomor Proyek** | Opsional | `PRJ-2026-001` | Kode unik proyek. Jika dikosongkan, sistem akan otomatis membuat nomor proyek resmi. |
| **Nama Pelanggan\*** | **Wajib** | `PT Maju Bersama` | Nama perusahaan pelanggan yang terdaftar di database CRM (Lihat Sheet 3). Case-insensitive. |
| **PIC Pelanggan** | Opsional | `Bambang Sutrisno` | Nama key person pelanggan jika sudah ada. |
| **Nama Proyek\*** | **Wajib** | `Pembangunan Gedung Kantor A` | Nama pekerjaan/proyek yang sedang di-follow up. |
| **Nilai Estimasi (Rp)** | Opsional | `500000000` | Estimasi nilai proyek dalam angka murni (tanpa titik, koma, atau Rp). |
| **Status** | Opsional | `Sedang Proses` | Pilihan: `Prospek` *(prospect)*, `Sedang Proses` *(in_progress)*, `Berhasil` *(won)*, `Gagal` *(lost)*. Default: *Prospek*. |
| **Lokasi** | Opsional | `Jakarta Selatan` | Kota / lokasi proyek konstruksi. |
| **Sumber Dana** | Opsional | `APBN` / `Swasta` | Asal pembiayaan proyek. |
| **Nama PIC Internal** | Opsional | `Irham` / `Amri` | Sales / PIC dari internal PT Wika. |
| **No. SPK** | Opsional | `SPK-WIKA-089` | Nomor Surat Perintah Kerja jika sudah ada. |
| **Catatan** | Opsional | `Prioritas follow up Q4` | Catatan tambahan untuk tim penawaran/sales. |

#### B. Sheet "Kebutuhan Produk Proyek"
| Nama Kolom | Sifat | Contoh Nilai | Keterangan & Validasi |
| :--- | :---: | :--- | :--- |
| **Nomor / Nama Proyek\*** | **Wajib** | `PRJ-2026-001` *atau* `Pembangunan Gedung Kantor A` | Referensi penghubung ke Sheet 1. Dapat diisi Nomor Proyek atau Nama Proyek persis. |
| **Nama Produk\*** | **Wajib** | `Beton Ready Mix K-300` | Nama produk yang ada di katalog produk CRM (Lihat Sheet 3). |
| **Kuantitas / Volume\*** | **Wajib** | `150` | Angka kuantitas kebutuhan material. |
| **Satuan** | Opsional | `m3` / `sak` / `batang` | Satuan produk (divalidasi dengan katalog produk). |
| **Catatan** | Opsional | `Pengecoran tahap 1 lantai dasar` | Spesifikasi atau catatan teknis kebutuhan material. |

---

### 5. Pilihan Mode Impor: Skip vs Upsert

1. **Lewati Duplikat (Skip) — [Direkomendasikan untuk Data Baru]**:
   - Jika nomor proyek atau kombinasi nama proyek & pelanggan sudah ada di database, baris tersebut akan **dilewati (diabaikan)**.
   - Data proyek lama yang sudah berjalan di CRM aman dan tidak mengalami perubahan.
2. **Perbarui Data Lama (Upsert) — [Untuk Sinkronisasi Data]**:
   - Jika proyek lama ditemukan, informasi proyek (nilai estimasi, status, lokasi, no SPK, dan daftar kebutuhan produk) akan **diperbarui** sesuai data terbaru dari berkas Excel.

---

### 6. Panduan Visual Langkah Demi Langkah

#### Langkah 1: Akses Menu Monitoring Proyek
Buka menu **Monitoring Proyek** (`/projects`), lalu klik tombol **"Import Excel"** yang berada di header halaman.

#### Langkah 2: Unduh Template & Unggah Berkas
1. Klik tombol **"Unduh Template (.xlsx)"** untuk memastikan Anda menggunakan format kolom dan referensi master data terkini.
2. Buka berkas template di Microsoft Excel, lalu isi data pada Sheet *Data Proyek* dan *Kebutuhan Produk Proyek*.
3. Tarik & lepas berkas ke area dropzone (atau klik untuk memilih file).

#### Langkah 3: Pratinjau & Validasi (Dry-Run)
Sistem otomatis membedah berkas Excel tanpa mengubah database:
- Tinjau tab **Data Proyek** dan **Kebutuhan Produk**.
- Jika terdapat kesalahan pengisian, sistem akan menampilkan tab **Catatan / Error** berisi nomor baris dan keterangan kesalahan secara spesifik.
- Pilih mode **Lewati Duplikat (Skip)** atau **Perbarui Data Lama (Upsert)**.
- Klik tombol **"Mulai Impor Proyek"**.

#### Langkah 4: Hasil Impor & Ringkasan Transaksi
Setelah transaksi database selesai, dialog akan menampilkan kartu ringkasan:
- **Proyek Baru**: Jumlah proyek yang berhasil dibuat.
- **Diperbarui**: Jumlah proyek yang diperbarui datanya.
- **Dilewati**: Jumlah proyek duplikat yang diabaikan.
- **Item Produk**: Total kebutuhan material yang berhasil ditautkan ke proyek.

#### Langkah 5: Muat Ulang & Tinjau Proyek di CRM
Klik tombol **"Selesai & Muat Ulang"**. Tabel Monitoring Proyek akan langsung ter-refresh secara otomatis dan proyek-proyek baru langsung muncul di tabel.

---

### 7. Tips & Penanganan Masalah (Troubleshooting)

| Kendala / Pesan Error | Penyebab | Solusi |
| :--- | :--- | :--- |
| **"Pelanggan '...' tidak ditemukan"** | Nama pelanggan belum terdaftar di CRM atau salah ketik. | Periksa nama pelanggan di Sheet 3 (*Panduan & Master Data*) atau tambahkan pelanggan baru terlebih dahulu di menu *Pelanggan*. |
| **"Produk '...' tidak ditemukan"** | Nama produk material tidak cocok dengan katalog CRM. | Sesuaikan nama produk dengan daftar di Sheet 3 atau tambahkan produk baru di *Master Data ➔ Produk*. |
| **"Nomor proyek duplikat dalam file Excel"** | Nomor proyek yang sama ditulis pada lebih dari satu baris di Sheet 1. | Pastikan setiap baris di Sheet 1 memiliki nomor proyek yang unik. |
| **"Nama atau nomor proyek wajib diisi pada Sheet Kebutuhan Produk"** | Kolom referensi proyek di Sheet 2 kosong. | Pastikan kolom *Nomor / Nama Proyek* di Sheet 2 diisi dengan nomor atau nama proyek yang ada di Sheet 1. |
| **Nilai estimasi / kuantitas tidak terbaca** | Penulisan angka menggunakan simbol "Rp" atau titik/koma pemisah ribuan. | Tuliskan angka murni, contoh: `500000000` (bukan `Rp 500.000.000`). |

---

*Dokumen SOP ini dapat diunduh dalam format PDF cetak resmi di: [`PANDUAN_IMPORT_PROYEK_EXCEL_CRM_WIKA.pdf`](file:///Users/codebeast/Documents/src/freelance/crm-wika/PANDUAN_IMPORT_PROYEK_EXCEL_CRM_WIKA.pdf).*
