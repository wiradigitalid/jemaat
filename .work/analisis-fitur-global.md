# Analisa Kelompok Fitur Global (Macro Feature Clusters) — Platform Jemaat

**Lokasi Dokumen:** `.work/analisis-fitur-global.md`  
**Tujuan:** Mengelompokkan seluruh kebutuhan fungsional sistem administrasi gereja ke dalam modul-modul makro (kelompok fitur senada) yang mandiri (*decoupled*) agar memudahkan pemilihan fokus pentahapan pengembangan (MVP ➔ Tahap Lanjutan).

---

## 1. Ringkasan Eksekutif: 10 Kelompok Fitur Makro (Macro Clusters)

Berdasarkan benchmark terhadap 10 platform ChMS terkemuka (ChurchCRM, Planning Center, Rock RMS, Breeze, Aplos, ChurchTools, Tithe.ly, Pushpay, Subsplash, Realm), kebutuhan operasional gereja dapat dipetakan ke dalam **10 Kelompok Fitur Makro**:

```
                                  ┌────────────────────────────────────────────────┐
                                  │   01. Core Membership & Household Registry     │ ◄── (Fondasi Utama)
                                  └───────────────────────┬────────────────────────┘
                                                          │
         ┌────────────────────────┬───────────────────────┼───────────────────────┬────────────────────────┐
         │                        │                       │                       │                        │
         ▼                        ▼                       ▼                       ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  02. Keuangan &  │    │  03. Liturgi &   │    │  04. Absensi &   │    │  05. Komunitas   │    │  06. Penggem-    │
│   Persembahan    │    │   Tata Ibadah    │    │  Check-In Anak   │    │  Sel (Komsel)    │    │ balaan & Disipel │
└──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘    └──────────────────┘
         │                        │                       │                       │                        │
         └────────────────────────┴───────────────────────┼───────────────────────┴────────────────────────┘
                                                          │
                                  ┌───────────────────────┴────────────────────────┐
                                  ▼                                                ▼
                        ┌──────────────────┐                             ┌──────────────────┐
                        │ 07. Manajemen    │                             │ 08. Komunikasi & │
                        │    Pelayanan     │                             │  Broadcast Pesan │
                        └──────────────────┘                             └──────────────────┘
                                  │                                                │
                                  └───────────────────────┬────────────────────────┘
                                                          │
                                  ┌───────────────────────┴────────────────────────┐
                                  ▼                                                ▼
                        ┌──────────────────┐                             ┌──────────────────┐
                        │ 09. Fasilitas &  │                             │ 10. Portal & App │
                        │ Reservasi Ruang  │                             │ Mandiri Jemaat   │
                        └──────────────────┘                             └──────────────────┘
```

---

## 2. Rincian 10 Kelompok Fitur Makro

---

### Modul 01: Core Membership & Household Registry (Data Induk & Keluarga)
> **Peran:** Fondasi (*Prerequisite*) dari semua modul lainnya. Tanpa data keluarga dan jemaat yang solid, modul keuangan, absensi, dan jadwal pelayanan tidak dapat berjalan akurat.

* **Fungsi Utama:**
  - **Manajemen Keluarga (*Household Container*):** Pengelompokan anggota jemaat ke dalam satu unit keluarga (Kepala Keluarga, Pasangan, Anak, Anggota Lain).
  - **Sinkronisasi Alamat Otomatis:** Perubahan alamat pada tingkat keluarga otomatis memperbarui seluruh anggota keluarga terkait.
  - **Siklus Hidup & Status Keanggotaan:** Klasifikasi jemaat (*Jemaat Tetap, Simpatisan/Tamu, Pindah, Non-Aktif, Meninggal*).
  - **Pencatatan Data Sakramental:** Tanggal Baptis Anak/Selam, Sidi/Konfirmasi, Pernikahan, dan Penyerahan Anak.
  - **Atribut Fleksibel (*Custom Fields*):** Kemampuan menambah kolom data kustom (misal: Suku, Golongan Darah, Pekerjaan, Wilayah/Rayon).
  - **Pencarian Cepat & Filter Multikriteria:** Sub-second search berdasarkan nama, nomor HP, email, atau status.
* **Tingkat Kebutuhan:** **Pondasi Mutlak (Wajib di Tahap Awal)**
* **Tingkat Kompleksitas Teknis:** `Medium`
* **Skor Manfaat Operasional:** `98 / 100`

---

### Modul 02: Church Finance & Giving Ledger (Keuangan & Persembahan)
> **Peran:** Mengamankan akuntabilitas penerimaan persembahan, perpuluhan, dan dana pembangunan gereja dari jemaat.

* **Fungsi Utama:**
  - **Pencatatan Batch Persembahan (Kolekte Mingguan):** Entri batch kantong kolekte/amplop minggu dengan kalkulator pecahan uang fisik (*cash denomination tally*).
  - **Rekonsiliasi Deposit Slip Tertutup (*Locked Ledger*):** Penguncian mutlak slip setoran bank setelah verifikasi total uang (mencegah manipulasi angka pasca-hitung).
  - **Multi-Pos Dana (*Designated Funds*):** Pemisahan pos persembahan (Kolekte Umum, Perpuluhan, Misi, Dana Pembangunan, Diakonia).
  - **Manajemen Nomor Amplop Unik:** Penomoran amplop persembahan tetap per keluarga/jemaat.
  - **Janji Iman (*Pledges Tracking*):** Pelacakan komitmen janji iman pembangunan dan persentase pelunasannya.
  - **Laporan Bukti Setor / Sumbangan Pajak PDF:** Cetak rekapitulasi penerimaan persembahan tahunan per jemaat/keluarga.
* **Tingkat Kebutuhan:** **Tinggi (Core Back-Office)**
* **Tingkat Kompleksitas Teknis:** `Medium - High`
* **Skor Manfaat Operasional:** `95 / 100`

---

### Modul 03: Service Liturgy & Worship Planning (Tata Ibadah & Musik)
> **Peran:** Mengatur jalannya ibadah minggu secara menit-ke-menit dan menyinkronkan tim musik/worship.

* **Fungsi Utama:**
  - **Penyusun Run-Sheet Tata Ibadah (*Order of Service*):** Urutan ibadah menit-ke-menit (Pujian Pembuka, Doa, Khotbah, Warta, Persembahan, Doa Berkat).
  - **Jam Hitung Mundur Live (*Live Service Timer*):** Indikator waktu live bagi worship leader, pengkhotbah, dan operator multimedia.
  - **Database Lagu & Transposisi Chord (*ChordPro Engine*):** Bank lirik lagu rohani dengan fitur ganti nada dasar (transpose nada, misal dari C ke D, atau penggunaan Capo) dan cetak lead sheet PDF.
  - **Lampiran Rehearsal Audio/MP3:** Mengunggah file contoh lagu/rekaman latihan untuk dipelajari pemusik.
  - **Cue Teknis AV/Multimedia:** Catatan teknis khusus operator sound, lighting, dan slide lirik projector.
* **Tingkat Kebutuhan:** **Tinggi untuk Gereja Kontemporer / Menengah**
* **Tingkat Kompleksitas Teknis:** `Medium - High`
* **Skor Manfaat Operasional:** `90 / 100`

---

### Modul 04: Attendance & Child Security Check-In (Absensi & Keamanan Anak)
> **Peran:** Menjaga keselamatan anak di Sekolah Minggu serta memantau tren kehadiran jemaat.

* **Fungsi Utama:**
  - **Absensi Ibadah Umum (*Headcount Tally*):** Pencatatan jumlah jemaat fisik per ibadah (Pria, Wanita, Anak, Tamu Baru).
  - **Kiosk Check-In Mandiri / Terpandu:** Layar sentuh input 4 digit nomor HP orang tua untuk memunculkan nama anak.
  - **Pencetakan Label Keamanan & Bukti Penjemputan (*Parent Claim Tag*):** Cetak label thermal stiker anak + stiker bukti penjemputan orang tua dengan kode acak yang sama (misal: `#842`).
  - **Peringatan Alergi & Kebutuhan Khusus:** Banner peringatan medis/alergi tercetak jelas pada stiker anak.
  - **Verifikasi Penjemputan (*Checkout Verification*):** Guru sekolah minggu memverifikasi kesesuaian kode sebelum melepas anak pulang.
  - **Notifikasi Darurat SMS/WA ke Orang Tua:** Panggilan darurat 1-klik ke HP orang tua jika anak menangis/sakit saat ibadah berlangsung.
* **Tingkat Kebutuhan:** **Sangat Tinggi jika gereja memiliki Sekolah Minggu aktif**
* **Tingkat Kompleksitas Teknis:** `High (memerlukan integrasi driver printer thermal & UI Kiosk)`
* **Skor Manfaat Operasional:** `92 / 100`

---

### Modul 05: Small Groups & Cell Ministry (Komunitas Sel / Komsel)
> **Peran:** Mengelola struktur kelompok sel, persekutuan doa wilayah, atau komsel keluarga.

* **Fungsi Utama:**
  - **Struktur & Hierarki Komsel:** Pembagian komsel berdasarkan wilayah/rayon, usia (Pemuda, Dewasa, Lansia), atau minat.
  - **Peran Pemimpin Komsel:** Penugasan Leader, Co-Leader, Host Tuan Rumah, dan Anggota.
  - **Roster & Absensi Pertemuan Komsel Mingguan:** Leader komsel mencatat absensi anggota dan tamu baru pertemuan sel dari HP.
  - **Pencarian Komsel (*Group Finder*):** Jemaat baru dapat mencari kelompok sel terdekat dari rumah mereka.
* **Tingkat Kebutuhan:** **Menengah - Tinggi**
* **Tingkat Kompleksitas Teknis:** `Low - Medium`
* **Skor Manfaat Operasional:** `85 / 100`

---

### Modul 06: Discipleship & Pastoral Care (Pemuridan & Penggembalaan)
> **Peran:** Memastikan setiap jiwa terpantau pertumbuhan rohaninya dan terlayani kebutuhan pastoralnya.

* **Fungsi Utama:**
  - **Alur Pemuridan (*Discipleship Process Queues / Pathways*):** Tahapan terstruktur (*Kartu Keputusan ➔ Kelas Fondasi ➔ Baptisan Selam ➔ Komsel ➔ Pelayanan*).
  - **Catatan Penggembalaan Rahasia (*Confidential Pastoral Notes*):** Catatan konseling, doa, dan kunjungan rumah sakit yang hanya bisa dibuka oleh pendeta/gembala (RBAC ketat).
  - **Manajemen Permohonan Doa (*Prayer Request Tracker*):** Pencatatan pokok doa jemaat dan update kesaksian/jawaban doa (*Praise Report*).
  - **Peringatan Jemaat Pasif (*Inactive Attrition Alert*):** Sistem otomatis memberi notifikasi jika ada jemaat aktif yang tidak hadir/tercatat selama 4 minggu berturut-turut.
* **Tingkat Kebutuhan:** **Tinggi untuk Gereja yang fokus pada penggembalaan personal**
* **Tingkat Kompleksitas Teknis:** `Medium`
* **Skor Manfaat Operasional:** `88 / 100`

---

### Modul 07: Volunteer Management & Rostering (Manajemen Pelayanan & Relawan)
> **Peran:** Mengatur jadwal rotasi pelayan ibadah lintas divisi agar tidak bentrok dan tidak terjadi *burnout*.

* **Fungsi Utama:**
  - **Matriks Penjadwalan Multi-Pekan:** Tampilan grid kalender jadwal pelayan (Worship Leader, Pemain Musik, Usher, Kolektan, Singer, Multimedia, Sound, Tim Doa).
  - **Pengaturan Tanggal Berhalangan (*Blackout Dates*):** Pelayan dapat mengajukan tanggal-tanggal di mana mereka tidak bisa bertugas.
  - **Notifikasi Jadwal & RSVP 1-Klik:** Pelayan menerima pesan WA/Email dan bisa langsung klik [Terima] atau [Tolak] tanpa perlu login rumit.
  - **Deteksi Bentrok Jadwal Lintas Divisi:** Peringatan otomatis jika 1 orang dijadwalkan di 2 peran berbeda pada jam yang sama.
  - **Database Talenta & Karunia Rohani:** Pencarian jemaat yang memiliki keahlian tertentu (misal: Bassist, Dokter, Desain Grafis) yang belum melayani.
* **Tingkat Kebutuhan:** **Sangat Tinggi (Kebutuhan rutin mingguan)**
* **Tingkat Kompleksitas Teknis:** `Medium - High`
* **Skor Manfaat Operasional:** `92 / 100`

---

### Modul 08: Communications & Mass Messaging (Komunikasi & Warta Jemaat)
> **Peran:** Menjembatani komunikasi gereja ke jemaat secara cepat dan terarah.

* **Fungsi Utama:**
  - **Broadcast WhatsApp / SMS Massal Terfilter:** Kirim pesan pengumuman ke segmen spesifik (misal: "Seluruh Orang Tua Anak Kelas 3-5", atau "Seluruh Pelayan Usher").
  - **Template Pesan Dinamis:** Penggunaan variabel otomatis seperti `{nama_depan}`, `{nama_komsel}`, `{tanggal_jadwal}`.
  - **Email Newsletter & Warta Mingguan:** Desain warta jemaat digital dengan lampiran jadwal kegiatan gereja.
  - **Log Pengiriman & Status Terkirim:** Pelacakan pesan sukses, gagal, atau nomor tidak aktif.
* **Tingkat Kebutuhan:** **Tinggi (Kebutuhan operasional)**
* **Tingkat Kompleksitas Teknis:** `Low - Medium (memerlukan integrasi gateway WA/SMS/SMTP)`
* **Skor Manfaat Operasional:** `86 / 100`

---

### Modul 09: Facility & Resource Booking (Peminjaman Ruangan & Peralatan)
> **Peran:** Mencegah tabrakan jadwal pemakaian ruangan dan aset gereja.

* **Fungsi Utama:**
  - **Kalender Peminjaman Ruangan:** Jadwal penggunaan Ruang Ibadah Utama, Ruang Konseling, Ruang Latihan Musik, Ruang Rapat Majelis.
  - **Deteksi Tabrakan Jadwal Otomatis (*Collision Detection*):** Sistem otomatis menolak/memberi peringatan merah jika ada 2 acara yang memesan ruangan yang sama pada jam yang bertabrakan.
  - **Bundling Peralatan AV & Kendaraan:** Peminjaman ruangan dapat menyertakan paket sound system, proyektor, dan mobil operasional gereja.
  - **Alur Persetujuan Pengurus Gedung (*Approval Workflow*):** Permohonan pinjam ruangan memerlukan persetujuan manajer fasilitas sebelum terkonfirmasi.
* **Tingkat Kebutuhan:** **Menengah (Sangat terasa untuk gereja dengan banyak aktivitas)**
* **Tingkat Kompleksitas Teknis:** `Medium`
* **Skor Manfaat Operasional:** `80 / 100`

---

### Modul 10: Member Self-Service & Mobile Portal (Aplikasi Mandiri Jemaat)
> **Peran:** Memberikan akses digital kepada jemaat untuk mandiri melihat data mereka sendiri.

* **Fungsi Utama:**
  - **Pembaruan Data Mandiri:** Jemaat dapat mengoreksi nomor HP, alamat, dan foto keluarga sendiri dari HP.
  - **Kartu Anggota Jemaat Digital (QR Code):** QR code unik per anggota untuk absensi cepat di gereja.
  - **Riwayat Persembahan Pribadi:** Jemaat dapat mengecek rekap persembahan/janji iman mereka secara pribadi.
  - **Warta Digital & Akses Materi Khotbah/Lagu:** Akses ringkasan khotbah mingguan dan bahan pendalaman Alkitab.
* **Tingkat Kebutuhan:** **Tahap Lanjutan (Fase 2/3)**
* **Tingkat Kompleksitas Teknis:** `High (memerlukan mobile app / responsive PWA dengan auth aman)`
* **Skor Manfaat Operasional:** `82 / 100`

---

## 3. Matriks Perbandingan 10 Klaster Fitur

| # | Klaster Fitur Global | Kompleksitas | Bobot Manfaat | Prasyarat Dependensi | Rekomendasi Alur Bangun |
|---|---|:---:|:---:|---|:---:|
| **01** | **Core Membership & Household** | `Medium` | **98 / 100** | *None (Fondasi Awal)* | **Fase 1 (Wajib Pertama)** |
| **02** | **Finance & Giving Ledger** | `Medium-High` | **95 / 100** | Modul 01 (Household) | **Fase 1 (Wajib Kedua)** |
| **03** | **Service Liturgy & Worship** | `Medium-High` | **90 / 100** | *None (Standalone)* | **Fase 2 / MVP Opsi B** |
| **04** | **Attendance & Child Check-In** | `High` | **92 / 100** | Modul 01 (Household) | **Fase 1 / 2** |
| **05** | **Small Groups & Komsel** | `Low-Medium` | **85 / 100** | Modul 01 (Member) | **Fase 2** |
| **06** | **Discipleship & Pastoral Care** | `Medium` | **88 / 100** | Modul 01 (Member) | **Fase 2** |
| **07** | **Volunteer Management** | `Medium-High` | **92 / 100** | Modul 01 + Modul 03 | **Fase 2** |
| **08** | **Communications (WA/SMS)** | `Low-Medium` | **86 / 100** | Modul 01 (Member) | **Fase 2** |
| **09** | **Facility & Resource Booking** | `Medium` | **80 / 100** | Modul 01 (Admin) | **Fase 3** |
| **10** | **Member Self-Service Portal** | `High` | **82 / 100** | Modul 01, 02, 07 | **Fase 3** |

---

## 4. Opsi Skenario Pemilihan Scope MVP (Pilihan Strategis untuk Wira)

Untuk memulai pembangunan platform **Jemaat** secara ramping (*lean*), realistis, dan cepat memberikan dampak nyata bagi gereja, berikut adalah **3 Alternatif Skenario Scope Paket Awal**:

### 🎯 Skenario A: "The Solid Administrative Core" (Sangat Direkomendasikan)
*Fokus menyelesaikan masalah paling mendasar gereja: Data Anggota + Pembukuan Persembahan.*
- **Modul 01:** Core Membership & Household (Keluarga, Anggota, Alamat auto-sync, Status, Sakramen, Cari cepat).
- **Modul 02:** Simple Finance & Giving (Entri kolekte persembahan mingguan, Pos dana, Rekonsiliasi deposit slip terkunci, Laporan tahunan PDF).
- **Modul 08:** Basic Messaging (Kirim warta / pengumuman via WA/Email dari hasil filter jemaat).
- *Alasan:* Paket ini langsung menggantikan spreadsheet gereja yang berantakan dengan database aman dan pembukuan transparan.

### 🎸 Skenario B: "Sunday Service & Ministry Orchestrator"
*Fokus menyelesaikan masalah operasional tim pelayanan & ibadah minggu (ala Planning Center).*
- **Modul 01:** Core Membership (Versi Ringkas).
- **Modul 03:** Service Liturgy & Song Matrix (Tata ibadah, transpose chord lagu, lead sheet PDF).
- **Modul 07:** Volunteer Scheduling (Jadwal pemusik, usher, singer dengan konfirmasi ketersediaan).
- *Alasan:* Sangat menarik bagi gereja yang tim pemusiknya sering kesulitan koordinasi lagu dan jadwal.

### 👶 Skenario C: "Family & Child Safety Pioneer"
*Fokus pada keluarga dan keselamatan anak di Sekolah Minggu (ala Rock RMS / Breeze).*
- **Modul 01:** Core Membership & Household.
- **Modul 04:** Child Security Check-In (Kiosk input 4 digit nomor HP orang tua, cetak stiker anak + stiker claim orang tua kode `#842`, absensi kelas).
- *Alasan:* Menjadi daya tarik utama bagi gereja keluarga yang mengutamakan keamanan anak dan tertib absensi sekolah minggu.

---

## 5. Langkah Selanjutnya yang Bisa Dipilih

1. **Pilih Skenario / Klaster Modul:** Menentukan apakah kita akan memprioritaskan **Skenario A (Administrasi & Keuangan)**, **Skenario B (Ibadah & Pelayanan)**, atau kombinasi spesifik pilihan Wira.
2. **Drill Down FR Terpilih:** Mengambil FR-FR relevan dari hasil riset 585 FR yang telah dievaluasi untuk modul yang dipilih, lalu mematangkannya menjadi spesifikasi PRD resmi platform `Jemaat`.
