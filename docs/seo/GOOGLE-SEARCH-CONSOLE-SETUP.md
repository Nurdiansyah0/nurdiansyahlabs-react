# Panduan Integrasi Google Search Console & URL Inspection API
**NurdiansyahLabs**

Dokumen ini menjelaskan langkah-langkah menghubungkan proyek **NurdiansyahLabs** ke Google Search Console secara langsung melalui API untuk memantau status indexing, mendeteksi halaman yang belum terindeks (*unindexed*), serta memeriksa error *structured data* (schema/citation) secara otomatis.

---

## 1. Persiapan Service Account (Google Cloud)

Untuk menghubungkan skrip ke Search Console tanpa login manual berulang kali:

1. Kunjungi [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru atau pilih proyek yang sudah ada.
3. Masuk ke menu **APIs & Services** > **Library**:
   - Cari **Google Search Console API**.
   - Klik **Enable** (Aktifkan).
4. Masuk ke menu **APIs & Services** > **Credentials**:
   - Klik **Create Credentials** > **Service Account**.
   - Masukkan nama akun layanan, misalnya: `gsc-inspector`.
   - Klik **Create and Continue**, lalu klik **Done**.
5. Klik pada Service Account yang baru dibuat dari daftar:
   - Pilih tab **Keys** > **Add Key** > **Create new key**.
   - Pilih format **JSON** dan klik **Create**.
   - File kunci JSON akan terunduh ke komputer Anda.
6. Pindahkan atau salin file tersebut ke root direktori proyek ini dan ubah namanya menjadi:
   ```bash
   gsc-credentials.json
   ```
   *(File ini sudah otomatis dimasukkan ke `.gitignore` sehingga tidak akan terunggah ke repositori Git).*

---

## 2. Berikan Izin Akses di Google Search Console

1. Buka [Google Search Console](https://search.google.com/search-console).
2. Pilih properti `https://nurdiansyahlabs.com` (atau `sc-domain:nurdiansyahlabs.com`).
3. Buka menu **Settings** (Pengaturan) di bilah navigasi kiri.
4. Klik **Users and permissions** (Pengguna dan izin) > **Add user** (Tambahkan pengguna).
5. Masukkan alamat email Service Account (contoh: `gsc-inspector@nama-proyek.iam.gserviceaccount.com`).
6. Berikan izin **Full** atau **Owner**, lalu klik **Add**.

---

## 3. Instalasi Dependensi Python

Jalankan perintah instalasi library Google API:

```bash
pip install google-api-python-client google-auth
```
atau menggunakan virtual environment:
```bash
python3 -m pip install google-api-python-client google-auth
```

---

## 4. Menjalankan Skrip Inspeksi (`scripts/gsc_inspector.py`)

Skrip telah disiapkan di [`scripts/gsc_inspector.py`](file:///home/nurdiansyah/dev/Personal_project/scripts/gsc_inspector.py).

### A. Memeriksa URL Tertentu
Untuk memeriksa halaman tertentu secara spesifik:
```bash
python3 scripts/gsc_inspector.py --url https://nurdiansyahlabs.com/blog
```

### B. Memeriksa Seluruh Rute Utama Website
Untuk menginspeksi semua halaman utama (layanan, showcase, trends, blog):
```bash
python3 scripts/gsc_inspector.py --all
```

### C. Memeriksa Status Sitemap
Untuk melihat status pemrosesan sitemap, tanggal unduh terakhir, dan jumlah error:
```bash
python3 scripts/gsc_inspector.py --sitemap
```

### D. Menghasilkan Output Format JSON
Jika ingin menyimpan atau memproses data lebih lanjut:
```bash
python3 scripts/gsc_inspector.py --url https://nurdiansyahlabs.com/ --json
```

---

## 5. Memahami Status & Indikator Error

| Status / Coverage | Kategori | Arti & Tindakan |
| :--- | :--- | :--- |
| **Submitted and indexed** | `Hijau / OK` | Halaman berhasil dirayapi dan sudah aktif muncul di pencarian Google. |
| **Discovered – currently not indexed** | `Kuning / Menunggu` | Google sudah mengetahui URL tersebut tetapi belum merayapinya karena antrean perayapan atau prioritas alokasi crawl budget. |
| **Crawled – currently not indexed** | `Kuning / Perhatian` | Google sudah merayapi halaman tetapi memilih tidak mengindeksnya. Biasanya perlu perbaikan kualitas konten atau penguatan tautan internal. |
| **Duplicate without user-selected canonical** | `Merah / Error` | Google menemukan duplikasi halaman dan memilih versi kanonis sendiri yang berbeda. Pastikan tag `<link rel="canonical">` diisi dengan benar. |
| **Structured Data Issue / Warning** | `Merah / Kuning` | Schema JSON-LD (misalnya `Article`, `Organization`, `BreadcrumbList`) kekurangan kolom wajib seperti tanggal publikasi, penulis, atau gambar. |
