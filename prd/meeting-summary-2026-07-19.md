# Meeting Summary — Mind Mapping CRM App Requirements

**Tanggal:** 19 Juli 2026
**Sumber:** Transkrip Google Meet (`Mind Mapping CRM App Requirements July 19 2026.csv`)
**Konteks:** Expansi requirement CRM Wikabeton untuk kompetisi inovasi (KII/QCC). Saat ini sudah top 3, target lanjut ke tahap nasional. Demo sudah pernah ditampilkan, sekarang menambah fitur agar lebih kompleks.

## Peserta
- **Mas Amir** (speaker 1) — Atasan marketing, pemilik requirement
- **Mas Irham** (speaker 2) — Developer (saya)
- **Mas Fari** (speaker 3) — Tim marketing, sharing konsep monitoring dari prototype Google+ChatGPT
- **Mas Riyadi** (speaker 4) — Tim marketing
- Pak Zul, Mas Agung, Kasul — hadir, sedikit masukan

---

## 5 Fitur Prioritas

Urutan prioritas — **chat blast ditaruh terakhir** karena operasional belum intensif.

### 1. Daftar Pelanggan (prioritas tertinggi)
- Struktur: **data perusahaan dulu → key person/key person di bawahnya**.
- Search bisa dari 2 sudut: **by perusahaan** atau **by key person** (cari nama → muncul perusahaannya).
- **Satu key person bisa terikat banyak perusahaan** (kasus "pinjam perusahaan" — orang yang sama muncul di PT ABC, PT CBD, dst). Jadi relasi many-to-many antara person ↔ perusahaan.
- Patokan data induk: **nama lengkap, bukan nama panggilan** (penting untuk dedup).

### 2. Monitoring Proyek / Sasaran
- Tracking proyek yang di-follow up: nama, lokasi, sumber dana, PIC, prospek.
- **Status proyek** (±4–5 kategori): prospek → sedang proses → **berhasil** (isi omset + nomor SPK) / **gagal** (isi alasan + siapa pesaing yang menang + berapa).
- Saat status masih prospek → wajib isi log kegiatan follow-up (monitoring kegiatan sales).
- Link otomatis ke **daftar pelanggan** (nama pelanggan & kontak auto-terisi dari database induk).

### 3. Penilaian Pelanggan
- **Kita menilai pelanggan**: skor atas kontrak berjalan & cara pembayaran (bermasalah atau tidak).
- Dikaitkan ke kontrak yang sedang berjalan dengan Wika Beton.
- **CSI (Customer Satisfaction Index)** = pelanggan menilai kita → **next stage**, baru muncul setelah monitoring proyek berjalan jalan.

### 4. Permintaan Penawaran (RFQ)
- User-nya = **customer/eksternal** (bukan internal). Customer baru atau lama isi form.
- Akses **PUBLIC** via link (seperti Google Form) — customer hanya isi form, tidak bisa lihat apa-apa setelahnya.
- Field: data diri + data perusahaan + kebutuhan + spesifikasi.
- Submit → **notifikasi masuk ke web internal & WA kantor** (nomor unit/WA yang sudah di-announce).
- Tujuan: dokumentasi semua permintaan harga (prosedur), walau eksekusinya via WA/email tetap jalan.

### 5. Chat Blast / Broadcast WA (prioritas terakhir)
- Kirim ucapan (Idul Fitri, Natal, tahun baru, terima kasih kerjasama) ke grup pelanggan sekaligus.
- Bisa segmentasi: pelanggan yang bekerjasama tahun ini, agama Islam (untuk Idul Fitri), dll.
- Pakai **WA Bisnis (Meta)** — ada pricing per message.
- Terhubung ke nomor WA kantor.

---

## Fitur Tambahan yang Diminta

- **Reminder di dashboard** — mirip Facebook: ulang tahun pelanggan hari ini/besok, hari raya keagamaan, **hari nasional/industri non-libur** (mis. 23 Juli hari anak nasional, hari konstruksi Indonesia, hari pelanggan nasional). Pakai data tanggal lahir yang di-submit.
- **Mapping lokasi** — dashboard peta untuk posisi kantor pelanggan & lokasi proyek (Sulawesi, Jakarta, dst). Nyambung ke Google Maps atau input titik manual.
- **Monitoring kunjungan** — format laporan kunjungan sales: ketemu siapa, bahas apa, instansi apa. Jadi laporan kinerja + karakter person yang dikunjungi.

---

## Keputusan Teknis (dari Mas Irham)

| Topik | Keputusan |
|-------|-----------|
| **Platform** | **Web first**, bukan native mobile. Installable ke home screen (PWA) — Android via Chrome langsung, iOS perlu langkah ekstra. Tampilan full-screen di HP. |
| **Keamanan data** | Internal app via **VPN** (Tailscale — berbayar, atau cari alternatif open source). Aplikasi internal tidak expose ke publik. |
| **Dua app** | (1) Web **internal** (private network), (2) web **public** (hanya form RFQ). |
| **Maps** | OpenStreetMap (gratis, kurang familiar) vs Google Maps (bayar per hit). |
| **Server** | Cloud private (AWS/GCP/Alibaba) **region Indonesia** (UU data localization), atau server kantor. |
| **Theme** | Dark/light mode sudah ada. Mas Amir prefer background putih, tapi balik preferensi masing-masing. |

---

## Tantangan Data (yang paling berat)

- **Existing data Excel masih unstructured**, belum ada relasi antar entitas, banyak redundansi.
- Perlu **ETL** (Extract-Transform-Load) + cleanup data duplikat. Ini paling memakan waktu.
- Solusi cepat: input manual + input data baru bersamaan (skip import data lama) → bisa cepat, tapi tidak bisa ambil source data lama otomatis.
- Mas Amir akan share database pelanggan (3 tahun terakhir), di-filter/disederhanakan dulu (nama perusahaan, nama lengkap, nomor telepon, dll).

---

## Timeline

| Tahap | Estimasi |
|-------|----------|
| **Demo (UI only, belum integrasi data)** | **1–2 minggu** → target **awal Agustus 2026** |
| **Integrasi penuh** (Maps, Meta WA, secure network, ETL data existing) | **2–3 bulan** setelah lolos prakualifikasi |
| Akselerasi (skip data existing, input manual) | 1,5–2 bulan |

### Next Steps
1. Build **demo UI dulu** (1–2 minggu) — semua 5 fitur dalam bentuk tampilan, tanpa integrasi.
2. Submit **makalah + contoh aplikasi** untuk seleksi nasional.
3. Mas Amir share database pelanggan (filtered).
4. Kalau lolos → integrasi penuh (2–3 bulan).
5. Sondir ulang ke tim: apakah 2 bulan realistis atau bisa dipercepat, fitur mana yang bisa dipangkas.
