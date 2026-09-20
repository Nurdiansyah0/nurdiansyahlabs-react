#!/usr/bin/env python3
"""
NurdiansyahLabs - Tech Trend Jacking & Monetization Engine
==========================================================
Tujuan:
1. Menangkap topik trending dari Google Trends (atau topik teknologi viral kustom).
2. Menghasilkan artikel opini teknologi mendalam yang dihubungkan langsung ke 4 layanan NurdiansyahLabs.
3. Menyertakan Call to Action (CTA) konversi tinggi langsung ke WhatsApp (+62 821-7601-2461).
4. Menghasilkan script postingan LinkedIn / WhatsApp Status untuk mendapatkan lead & closing klien pertama!
5. Menyimpan langsung ke MySQL (atau file SQL & Markdown siap deploy).
"""

import sys
import os
import re
import json
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime

# Path setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
try:
    os.makedirs(DATA_DIR, exist_ok=True)
except Exception:
    pass

SERVICES = {
    "A": {
        "label": "Landing Page",
        "name": "Jasa Pembuatan Landing Page & Web Konversi Tinggi",
        "accent": "#2563eb",
        "accentLight": "#dbeafe",
        "hook_focus": "kecepatan website, user experience, konversi leads, dan branding modern"
    },
    "B": {
        "label": "Fullstack Web",
        "name": "Jasa Fullstack Web Application & Software Kustom",
        "accent": "#7c3aed",
        "accentLight": "#ede9fe",
        "hook_focus": "sistem backend terintegrasi, database handal, API modern, dan otomasi proses bisnis"
    },
    "C": {
        "label": "Data Analyst",
        "name": "Konsultan Data Analyst & Dashboard Bisnis Interaktif",
        "accent": "#059669",
        "accentLight": "#d1fae5",
        "hook_focus": "visualisasi data penjualan, tracking KPI, efisiensi operasional, dan dashboard interaktif"
    },
    "D": {
        "label": "Data Scientist",
        "name": "Jasa Machine Learning & Integrasi AI Kustom",
        "accent": "#9333ea",
        "accentLight": "#fae8ff",
        "hook_focus": "prediksi penjualan, segmentasi pelanggan cerdas, integrasi LLM/AI kustom, dan otomasi cerdas"
    }
}

CURATED_VIRAL_TECH = [
    {
        "topic": "Integrasi AI Agent dan WhatsApp Bot untuk Otomasi CS Toko Online",
        "service": "B",
        "keyword": "whatsapp bot ai toko online",
        "summary": "Bagaimana memanfaatkan LLM dan webhook WhatsApp untuk membalas chat pembeli 24/7 otomatis tanpa gaji admin tambahan."
    },
    {
        "topic": "Kenapa Bisnis Modern Mulai Meninggalkan WordPress dan Beralih ke Custom Web App",
        "service": "A",
        "keyword": "jasa website custom vs wordpress",
        "summary": "Perbandingan performa, keamanan, dan conversion rate antara CMS template lama vs web app modern React/Vite."
    },
    {
        "topic": "Dari Excel Berantakan ke Dashboard Interaktif: Cara Toko & UMKM Memantau Profit Real-Time",
        "service": "C",
        "keyword": "jasa dashboard bisnis excel power bi",
        "summary": "Strategi merapikan ribuan baris transaksi penjualan menjadi satu layar visual yang bisa dipantau lewat HP pemilik bisnis."
    },
    {
        "topic": "Implementasi Model AI & Machine Learning untuk Prediksi Stok Barang dan Mencegah Dead Stock",
        "service": "D",
        "keyword": "jasa machine learning prediksi penjualan",
        "summary": "Cara bisnis retail dan F&B memprediksi lonjakan permintaan mingguan menggunakan algoritma data science sederhana."
    },
    {
        "topic": "Strategi Membangun Landing Page Cepat yang Mengonversi Pengunjung Jadi Pembeli di WhatsApp",
        "service": "A",
        "keyword": "jasa buat landing page wa umkm",
        "summary": "Formula struktur landing page 2026: Headline kuat, social proof, dan tombol CTA melayang yang meningkatkan rasio chat masuk hingga 3x lipat."
    }
]

def fetch_google_trends(geo="ID"):
    """Fetch daily trending searches from Google Trends RSS."""
    url = f"https://trends.google.com/trending/rss?geo={geo}"
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    })
    results = []
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            xml_data = response.read()
            root = ET.fromstring(xml_data)
            for item in root.findall(".//item"):
                title_elem = item.find("title")
                approx_elem = item.find("{https://trends.google.com/trending/rss}approx_traffic")
                link_elem = item.find("link")
                pubdate_elem = item.find("pubDate")
                
                title = title_elem.text if title_elem is not None else ""
                traffic = approx_elem.text if approx_elem is not None else "N/A"
                link = link_elem.text if link_elem is not None else ""
                pubdate = pubdate_elem.text if pubdate_elem is not None else ""

                if title:
                    results.append({
                        "title": title,
                        "traffic": traffic,
                        "link": link,
                        "pubDate": pubdate
                    })
    except Exception as e:
        print(f"⚠️ Warning: Gagal menarik Google Trends RSS: {e}")
    return results

def create_slug(title):
    slug = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
    slug = re.sub(r'[\s_]+', '-', slug).strip('-')
    return slug[:80]

def generate_article_content(topic, service_code="B", custom_notes=""):
    """
    Generates a deep, authoritative, high-converting article linking the tech trend to NurdiansyahLabs.
    """
    svc = SERVICES.get(service_code, SERVICES["B"])
    slug = create_slug(topic)
    date_str = datetime.now().strftime("%d %B %Y")
    wa_number = "6282176012461"
    wa_text = urllib.parse.quote(f"Halo NurdiansyahLabs, saya membaca artikel Anda tentang '{topic}' dan ingin konsultasi pembuatan sistem untuk bisnis saya.")
    wa_link = f"https://wa.me/{wa_number}?text={wa_text}"

    title = f"{topic}: Panduan Strategis & Cara Menerapkannya di Bisnis Anda ({datetime.now().year})"
    description = (
        f"Pelajari tren {topic}, mengapa ini penting bagi operasional bisnis dan UMKM di Indonesia, "
        f"serta bagaimana NurdiansyahLabs dapat membantu Anda mengimplementasikannya secara kustom."
    )

    content = f"""## Mengapa Tren Ini Menjadi Titik Balik Penting?

Perkembangan teknologi di tahun {datetime.now().year} bergerak sangat cepat. Topik mengenai **{topic}** bukan lagi sekadar wacana teoretis di kalangan praktisi IT, melainkan kebutuhan riil yang berdampak langsung pada efisiensi biaya, kecepatan layanan, dan pertumbuhan omzet bisnis.

Bagi pemilik bisnis, UMKM, maupun pengambil keputusan di perusahaan Indonesia, ada satu fakta fundamental yang tidak boleh diabaikan: **Teknologi baru hanya berharga jika berhasil menyelesaikan masalah operasional nyata atau menambah pemasukan.**

Banyak pelaku usaha mencoba mengadopsi tren ini tanpa strategi yang jelas, sehingga berakhir dengan biaya mahal namun tanpa hasil nyata. Mari kita bedah bagaimana cara memanfaatkannya dengan pendekatan yang tepat sasaran.

---

## 3 Tantangan Nyata yang Dihadapi Pebisnis di Lapangan

Berdasarkan pengalaman kami mendampingi berbagai proyek digital di Indonesia, terdapat 3 hambatan utama saat mengadopsi solusi seperti ini:

1. **Kompleksitas Teknis & Kurangnya Talenta:** Mengintegrasikan sistem baru membutuhkan pemahaman mendalam tentang arsitektur perangkat lunak, keamanan data, dan reliabilitas server.
2. **Tools Siap Pakai yang Kaku:** Layanan berlangganan bulanan dari luar negeri sering kali mahal, mengenakan tarif dolar, dan tidak bisa disesuaikan dengan alur kerja khas bisnis lokal di Indonesia.
3. **Ketiadaan Integrasi End-to-End:** Banyak sistem berjalan terpisah (silo)—kasir tidak terhubung ke pembukuan, chat pelanggan tidak tersinkronisasi dengan database, dan laporan penjualan harus direkap manual setiap malam.

---

## Solusi Praktis: Pendekatan Kustom dan Terukur

Untuk mengubah tren **{topic}** menjadi keunggulan kompetitif, bisnis Anda membutuhkan sistem yang dirancang spesifik sesuai kebutuhan:

* **Arsitektur Ringan & Cepat:** Dibangun dengan teknologi modern (seperti stack React, Python/PHP backend, dan database teroptimasi) agar sistem berjalan mulus di perangkat seluler maupun desktop.
* **Fokus pada {svc['hook_focus']}:** Setiap baris kode yang dibangun diarahkan langsung untuk memangkas waktu kerja manual atau meningkatkan angka penjualan.
* **Kepemilikan Penuh (Zero Vendor Lock-in):** Anda memiliki kontrol penuh atas data dan sistem bisnis Anda sendiri tanpa harus terkunci pada biaya langganan bulanan platform pihak ketiga yang terus naik.

---

## Bagaimana NurdiansyahLabs Membantu Bisnis Anda?

**NurdiansyahLabs** adalah studio rekayasa perangkat lunak dan analisis data independen yang berfokus membantu UMKM, startup, dan bisnis di Indonesia memiliki infrastruktur digital kelas profesional dengan biaya yang realistis dan transparan.

Melalui layanan **{svc['name']}**, kami siap mendampingi Anda mulai dari:
1. **Analisis Kebutuhan & Desain Alur:** Menentukan fitur yang benar-benar esensial untuk bisnis Anda tanpa membuang anggaran untuk hal yang tidak perlu.
2. **Pengembangan & Integrasi Kustom:** Membangun antarmuka yang intuitif dan sistem backend yang stabil.
3. **Deployment & Pendampingan:** Memastikan sistem aktif di domain bisnis Anda dan tim Anda siap mengoperasikannya dengan mudah.

---

### 💡 Siap Menerapkan Solusi Ini pada Bisnis Anda?

Jangan biarkan kompetitor Anda melangkah lebih dulu. Konsultasikan ide dan kendala teknis bisnis Anda bersama kami secara langsung.

👉 **[Klik di Sini untuk Konsultasi Gratis via WhatsApp]({wa_link})**  
*(Diskusikan langsung kebutuhan Anda dalam 15 menit — tanpa komitmen awal).*
"""

    faqs = [
        {
            "q": f"Berapa estimasi waktu pengerjaan untuk implementasi {topic}?",
            "a": "Waktu pengerjaan berkisar antara 5 hingga 14 hari kerja tergantung pada kompleksitas fitur dan integrasi data yang dibutuhkan."
        },
        {
            "q": "Apakah sistem yang dibangun di NurdiansyahLabs bisa disesuaikan dengan alur bisnis saya?",
            "a": "Ya, 100% kustom. Kami merancang arsitektur perangkat lunak sesuai dengan alur kerja spesifik bisnis Anda tanpa batasan template."
        },
        {
            "q": "Bagaimana jika saya belum memiliki tim teknis internal?",
            "a": "NurdiansyahLabs menyediakan dokumentasi lengkap, panduan operasional sederhana, serta garansi pendampingan pasca-deployment."
        }
    ]

    # Generate Social Media Outreach Script (LinkedIn & WhatsApp Status)
    social_script = f"""=== 📢 SCRIPT POSTINGAN LINKEDIN / WHATSAPP STATUS (UNTUK DAPAT LEADS HARI INI) ===

Topik: {topic}

--------------------------------------------------------------------------------
[HOOK PEMBUKA]
Banyak orang heboh membicarakan {topic}.
Tapi pertanyaan terbesarnya: "Gimana cara teknologi ini bisa nambah omzet atau motong biaya operasional di bisnis nyata?"

[ISI CERITA / SOLUSI SINGKAT]
Kebanyakan pemilik usaha menghabiskan puluhan jam seminggu hanya untuk pekerjaan repetitif yang sebenarnya bisa diotomasi dalam 1 klik.

Kemarin saya baru saja menyusun arsitektur sistem untuk menyelesaikan masalah ini:
✅ Menghilangkan input data ganda manual
✅ Sistem langsung terhubung ke WhatsApp & database internal
✅ Tanpa biaya langganan software luar negeri yang mahal

[CALL TO ACTION / UMPAN DISKUSI]
Bagi rekan-rekan pengusaha atau pemilik bisnis yang ingin melihat demonya atau ingin diskusi bagaimana sistem ini bisa diterapkan di toko/perusahaan Anda:

Silakan tinggalkan komentar "MAU" atau langsung chat WhatsApp saya di sini:
👉 {wa_link}

(Konsultasi 10 menit gratis, kita bedah potensinya bersama).
--------------------------------------------------------------------------------
"""

    post_data = {
        "slug": slug,
        "title": title,
        "description": description,
        "service": service_code,
        "serviceLabel": svc["label"],
        "accent": svc["accent"],
        "accentLight": svc["accentLight"],
        "images": json.dumps(["/assets/showcase1.webp"]),
        "faqs": json.dumps(faqs, ensure_ascii=False),
        "content": content,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

    return post_data, social_script

def save_to_files(post_data, social_script):
    """Save the post as Markdown and SQL files."""
    slug = post_data["slug"]
    md_path = os.path.join(DATA_DIR, f"{slug}.md")
    sql_path = os.path.join(DATA_DIR, f"{slug}.sql")
    social_path = os.path.join(DATA_DIR, f"{slug}_social.txt")

    # Save SQL
    def escape_sql(val):
        if val is None:
            return "NULL"
        return "'" + str(val).replace("'", "''") + "'"

    sql = f"""INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content, created_at)
VALUES (
    {escape_sql(post_data['slug'])},
    {escape_sql(post_data['title'])},
    {escape_sql(post_data['description'])},
    {escape_sql(post_data['service'])},
    {escape_sql(post_data['serviceLabel'])},
    {escape_sql(post_data['accent'])},
    {escape_sql(post_data['accentLight'])},
    {escape_sql(post_data['images'])},
    {escape_sql(post_data['faqs'])},
    {escape_sql(post_data['content'])},
    NOW()
) ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    description = VALUES(description),
    content = VALUES(content),
    faqs = VALUES(faqs);
"""
    try:
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(f"# {post_data['title']}\n\n")
            f.write(f"> **Deskripsi:** {post_data['description']}\n\n")
            f.write(f"> **Layanan:** {post_data['serviceLabel']} ({post_data['service']})\n\n")
            f.write(post_data["content"])

        with open(social_path, "w", encoding="utf-8") as f:
            f.write(social_script)

        with open(sql_path, "w", encoding="utf-8") as f:
            f.write(sql)
    except OSError as e:
        print(f"⚠️ Catatan: File tidak dapat disimpan ke disk lokal ({e}), menampilkan output langsung:")

    return md_path, sql_path, social_path

def try_insert_database(post_data):
    """Attempt direct insertion into local or cPanel database via PHP db connection."""
    try:
        # Check if php is available
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.php', delete=False) as f:
            temp_php = f.name
            f.write(f"""<?php
require_once '{BASE_DIR}/database/db.php';
$pdo = getDB();
if (!$pdo) {{
    echo "NO_DB";
    exit(0);
}}
$sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content)
        VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :images, :faqs, :content)
        ON DUPLICATE KEY UPDATE title = :title, description = :description, content = :content";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    'slug' => {json.dumps(post_data['slug'])},
    'title' => {json.dumps(post_data['title'])},
    'description' => {json.dumps(post_data['description'])},
    'service' => {json.dumps(post_data['service'])},
    'serviceLabel' => {json.dumps(post_data['serviceLabel'])},
    'accent' => {json.dumps(post_data['accent'])},
    'accentLight' => {json.dumps(post_data['accentLight'])},
    'images' => {json.dumps(post_data['images'])},
    'faqs' => {json.dumps(post_data['faqs'])},
    'content' => {json.dumps(post_data['content'])}
]);
echo "SUCCESS";
?>""")

        status = "UNKNOWN"
        try:
            cmd = f"php {temp_php}"
            output = os.popen(cmd).read().strip()
            if "SUCCESS" in output:
                status = "INSERTED"
            elif "NO_DB" in output:
                status = "NO_LOCAL_DB"
            else:
                status = f"INFO: {output}"
        except Exception as e:
            status = f"EXCEPTION: {e}"
        finally:
            if os.path.exists(temp_php):
                os.remove(temp_php)
        return status
    except Exception as e:
        return f"CANNOT_CONNECT: {e}"

def main():
    import argparse
    parser = argparse.ArgumentParser(description="NurdiansyahLabs Tech Trend Jacking & Client Acquisition Tool")
    parser.add_argument("--list-trends", action="store_true", help="Tampilkan tren Google Trends Indonesia terkini")
    parser.add_argument("--topic", type=str, help="Topik atau kata kunci teknologi yang ingin diangkat")
    parser.add_argument("--service", type=str, choices=["A", "B", "C", "D"], default="B", help="Layanan yang ingin dipromosikan (A: Landing Page, B: Fullstack, C: Data Analyst, D: AI/ML)")
    parser.add_argument("--auto", action="store_true", help="Otomatis pilih topik teknologi teratas dan hasilkan artikel")

    args = parser.parse_args()

    print("\n" + "="*70)
    print("🚀 NurdiansyahLabs — Trend Jacking & Client Acquisition Engine")
    print("="*70)

    if args.list_trends:
        print("\n🔍 Mengambil data Google Trends Indonesia (geo=ID)...")
        trends = fetch_google_trends("ID")
        if not trends:
            print("Tidak dapat mengambil tren saat ini.")
            return
        print(f"\n📊 Ditemukan {len(trends)} Topik Trending Teratas Hari Ini:")
        for idx, t in enumerate(trends, 1):
            print(f"  {idx}. {t['title']} (Volume: {t['traffic']})")
        print("\n💡 Tips: Untuk membuat artikel dari salah satu tren di atas, jalankan:")
        print(f"   python3 scripts/tech_trend_publisher.py --topic \"{trends[0]['title']}\" --service B\n")
        return

    selected_topic = args.topic
    selected_service = args.service

    if args.auto:
        # Pick from curated viral tech list or live trends
        curated = CURATED_VIRAL_TECH[0]
        selected_topic = curated["topic"]
        selected_service = curated["service"]
        print(f"\n⚡ Mode Auto dipilih: Memproses topik viral terverifikasi:")
        print(f"   📌 Topik: {selected_topic}")
        print(f"   📌 Layanan Target: {SERVICES[selected_service]['name']}")

    if not selected_topic:
        print("\n📋 Topik belum ditentukan. Pilihan opsi cepat:")
        for idx, item in enumerate(CURATED_VIRAL_TECH, 1):
            print(f"  [{idx}] {item['topic']} (Layanan: {item['service']} - {SERVICES[item['service']]['label']})")
        print("\nKetik angka pilihan [1-5] atau ketik topik kustom Anda sendiri:")
        try:
            user_input = input("Pilihan Anda: ").strip()
            if user_input.isdigit() and 1 <= int(user_input) <= len(CURATED_VIRAL_TECH):
                chosen = CURATED_VIRAL_TECH[int(user_input) - 1]
                selected_topic = chosen["topic"]
                selected_service = chosen["service"]
            elif user_input:
                selected_topic = user_input
            else:
                chosen = CURATED_VIRAL_TECH[0]
                selected_topic = chosen["topic"]
                selected_service = chosen["service"]
        except EOFError:
            chosen = CURATED_VIRAL_TECH[0]
            selected_topic = chosen["topic"]
            selected_service = chosen["service"]

    print(f"\n⏳ Membuat artikel konversi tinggi & strategi closing untuk: '{selected_topic}'...")
    post_data, social_script = generate_article_content(selected_topic, selected_service)

    # Save to files
    md_path, sql_path, social_path = save_to_files(post_data, social_script)

    print("\n✅ GENERASI BERHASIL!")
    print(f"📄 Artikel Markdown : {md_path}")
    print(f"💾 Script SQL Query : {sql_path}")
    print(f"📢 Script Outreach  : {social_path}")

    # Try database insert
    db_status = try_insert_database(post_data)
    if db_status == "INSERTED":
        print(f"🎉 Sukses disimpan langsung ke Database! URL: https://nurdiansyahlabs.com/blog/{post_data['slug']}")
    elif db_status == "NO_LOCAL_DB":
        print("ℹ️ Database MySQL lokal tidak aktif/tersambung (normal jika di lingkungan dev tanpa container).")
        print(f"👉 File SQL telah dibuat di '{sql_path}'. Anda dapat mengimpornya langsung di cPanel phpMyAdmin,")
        print(f"   atau salin isinya ke menu Admin Dashboard (/admin).")
    else:
        print(f"ℹ️ Status DB: {db_status}")

    print("\n" + social_script)
    print("="*70)
    print("🎯 LANGKAH SELANJUTNYA UNTUK MENGHASILKAN RUPIAH PERTAMA:")
    print("1. Salin script di atas ke WhatsApp Status dan LinkedIn Anda HARI INI.")
    print("2. Jika ada teman/koneksi yang merespon, tawarkan demo aplikasi yang sudah ada di portofolio Anda.")
    print("3. Buka cPanel atau jalankan deploy.sh agar artikel di atas live di nurdiansyahlabs.com/blog.")
    print("="*70 + "\n")

if __name__ == "__main__":
    main()
