# Meeting Summary — Demo CRM App Recording

**Tanggal:** 9 Agustus 2026
**Sumber:** Transkrip `Demo CRM App Recording Aug 9 2026.csv`
**Konteks:** Review demo UI CRM Wikabeton yang sudah dibangun dari [demo-ui-only-plan.md](demo-ui-only-plan.md). Klien beri koreksi fitur + next step kontrak/proposal. Demo dinilai sudah mantap secara fitur & logika, tinggal penyambungan antar menu + detailing form.

## Peserta
- **Mas Fari** (speaker 3) — Tim marketing, pemberi requirement utama
- **Mas Irham** (speaker 1) — Developer (saya)
- **Mas Amir** (speaker 2) — Atasan marketing
- **Mas Sul / Kasul** (speaker 4) — Tim marketing
- Pak Zul, Mas Agung, Mas Rizky — hadir

---

## Poin Utama (urutan dari transkrip)

### 1. Menu Penawaran — link ke Topik & Proyek
- Topik di permintaan penawaran jangan **drop-down**. Buat **tombol khusus "Penawaran"**. Topik tetap bisa diketik manual (RFQ, permintaan penawaran, dll) — dua opsi: pilih dari topik yang sudah ada ATAU ketik sendiri.
- Saat topik = permintaan penawaran → muncul tombol **pembuatan penawaran** → masuk ke monitoring penawaran.
- Form penawaran bisa diisi **internal (tim sales)** juga, bukan hanya eksternal.
- **Nama produk** harus fix (bukan opsi/isian bebas) supaya filter & kategori saat pencarian tidak beragam istilah.

### 2. Status Penawaran — perjelas maknanya
- Status saat ini: `baru masuk` / `dalam tinjauan` / `direspon`.
- `dalam tinjauan` = penawaran lagi dibuat. `sudah dikirim` = baru direspon klien.
- Usulan rename kolom status supaya tidak dobel dengan status proyek → "sudah dikirim penawaran" / "tindak lanjut".

### 3. Penawaran ↔ Proyek — sinkronisasi inti
- **Proyek = base data induk.** Nama proyek di penawaran harus **sinkron** dengan database monitoring proyek (bukan input bebas).
- Kasus dedup: klien submit "Apartemen Tanjung Bunga Makassar", di internal kita sudah ada "Pembangunan Apartemen Makassar" → harus bisa dilingkan.
- **Nama proyek + status proyek** (berhasil/gagal/prospek) tampil di menu penawaran, sinkron dari database proyek. Sales lihat "penawaran sudah dikirim, status proyek masih prospek → follow up lagi".
- Penawaran = sekedar **inisialisasi awal**. Manajemen lanjutan ada di proyek. Tinggal dilingkan saat penawaran.

### 4. Penilaian Pelanggan — scoring ada rumusannya
- Penilaian **bukan** per pertemuan/follow-up (itu per-teman-teman kumpul di log). Penilaian base-nya = **terhadap 1 proyek + nama perusahaan**, setelah proyek **berhasil** & lapangan selesai.
- Skor pembayaran ada di level **perusahaan**, bukan person.
- **Key person** → penilaian lebih ke karakter/profiling (subjektif), bukan skor numerik.
- Tolak ukur dari Mas Sul:
  - **Cara bayar**: tagihan masuk maks 3 hari, klien bayar 7 hari → kurangi nilai.
  - **Kemudahan transaksi**: harga ditawarkan langsung diterima tanpa nego → nilai bagus ("sangat baik").
- Output: kategori `istimewa` (bintang 5) / `baik` (bintang 4) + keterangan. Rumusan standar akan disampaikan Mas Sul.
- **Bintang otomatis** dari scoring (bukan klik manual). Muncul pilihan penilaian setelah kontrak/proyek **berhasil**.

### 5. Profiling Key Person — view khusus per orang
- Setiap key person (mis. Pak Hendran) punya **view profil khusus**: data pribadi, profiling (hobi, karakter — manual, dideskripsikan sales), historis penilaian.
- Terpisah dari info perusahaan. Kemarin pernah ada, "kehapus karena satu dan lain hal" → perlu direstore.
- Log pelanggan (skor hubungan, skor pembayaran): **skor pembayaran = di perusahaan**, skor hubungan = di person.

### 6. Riwayat Kontrak = Riwayat Proyek di perusahaan
- "Riwayat kontrak" → anggap sebagai **riwayat proyek yang berhasil** atas nama perusahaan + PIC-nya.
- Proyek jadi base data untuk isi riwayat kontrak: nama proyek + nilai omset + terhadap pelanggan/perusahaan.
- Historis penilaian muncul di riwayat pelanggan.

### 7. Info Umum Perusahaan — perlu field tambahan
- Saat ini field kurang. Tambah: **lokasi, NPWP, SKT, alamat** (PT belum ada alamat), email kantor, website.
- **Segmentasi** lebih spesifik: BUMN, swasta nasional, swasta asing.
- WhatsApp/email lebih ke person. Info umum = data perusahaan.
- Form detail akan dikoreksi bersama tim (tambah-kurang isian).

### 8. Dashboard & Notifikasi
- **Notifikasi (lonceng)** di header, bukan hanya di dashboard. Isi: permintaan penawaran belum direspons, proyek perlu follow-up, ulang tahun pelanggan, hari raya, hari nasional.
- Dashboard lebih ke **progress**. Notifikasi = pengingat aksi ("apa yang harus dilakukan").
- Tujuan: semua pemberitahuan ada, tapi notif diminimalkan (tidak spam).

### 9. Peta Proyek (menu baru)
- Menu **"Peta Proyek"** terpisah (bukan di dashboard — takut berat).
- Tampilkan semua proyek yang sudah di-tag lokasi sebagai titik di peta. Klik titik → popup data proyek (nama, status, dll). Bisa juga hover/cursor.
- **Warna titik ngacu status proyek**: proses, berhasil (hijau), dst.
- Pakai peta yang sudah ada (OpenStreetMap, bukan Google Maps).

### 10. Penilaian pelanggan otomatis (klarifikasi Mas Sul)
- Tolak ukur: cara bayar + tidak nego harga. Bintang otomatis dari scoring, bukan klik manual.
- Muncul pilihan penilaian setelah proyek **berhasil dulu**. Kalau tidak berhasil → tidak perlu dinilai.
- Mas Sul akan buat sendiri kategori & tolak ukur, kirim ke Mas Irham.

---

## Keputusan Bisnis / Next Steps

| Item | Detail |
|------|--------|
| **Prioritas implementasi segera** | (1) Sambungkan penawaran ↔ proyek, (2) base data proyek jadi induk, (3) detailing form info perusahaan/key person, (4) peta proyek. |
| **Proposal visual** | Mas Irham buat **proposal visual** (bukan teks) untuk presentasi ke manajemen pusat. Sertakan screenshot dashboard + menu fitur + batasan demo. |
| **Draft kontrak** | Sertakan draft kontrak kerja sama + **dokumen kerahasiaan** (bukan NDA — lebih ke keep data). |
| **Rename aplikasi** | "CRM WIKA" terlalu mirip punya kantor pusat → ganti nama lebih **catchy & mudah diingat**. Proposal sudah pakai nama baru. |
| **Timeline** | Minggu depan Selasa (11 Agustus 2026) proposal siap. Akhir Agustus presentasi ke pusat → September submit laporan → Oktober verifikasi → November kepastian lolos/tidak. |
| **Kontrak bertahap** | Kontrak demo dulu → presentasi pusat → kalau lolos, kontrak build full (bisa dijalankan + tersinkronisasi multi-user/server). |
| **Kendala demo saat ini** | Data belum persisten (tersimpan di satu laptop, belum online). Tampilan & input bisa, tapi antar-device belum sinkron. Cukup untuk demo visual. |

---

## Implikasi untuk PRD & Demo Plan

Update yang perlu masuk ke PRD / [demo-ui-only-plan.md](demo-ui-only-plan.md):

1. **Quotation**: tambah tombol "Penawaran", topik 2-mode (pilih/ketik), link `projectId` wajib, nama produk fix dari master.
2. **Quotation ↔ Project sync**: tampil nama + status proyek di list penawaran, dari database proyek.
3. **Customer rating**: bintang otomatis dari skor, rumusan dari Mas Sul (pending). Skor pembayaran = level perusahaan. Hanya muncul setelah proyek `won`.
4. **Key person profile view**: halaman profil per orang (data pribadi + profiling + historis penilaian), restore yang hilang.
5. **Customer info umum**: tambah field lokasi, NPWP, SKT, alamat, email kantor, website, segmentasi (BUMN/swasta nasional/swasta asing).
6. **Notification bell** di header (bukan hanya dashboard).
7. **Peta Proyek**: menu baru, peta + titik berwarna per status, popup data proyek.
8. **Riwayat kontrak** = riwayat proyek won per perusahaan.
9. **Proposal visual + draft kontrak + dokumen kerahasiaan + rename app** = deliverable non-code minggu ini.

---

## Referensi
- Transkrip: [Demo CRM App Recording Aug 9 2026.csv](Demo%20CRM%20App%20Recording%20Aug%209%202026.csv)
- Meeting sebelumnya: [meeting-summary-2026-07-19.md](meeting-summary-2026-07-19.md)
- Plan demo: [demo-ui-only-plan.md](demo-ui-only-plan.md)
- PRD: [wikabeton-crm-prd.md](wikabeton-crm-prd.md)
