<?php
/**
 * NurdiansyahLabs – Enterprise Software & Full SDLC Blog Seeder
 * Run on cPanel terminal or local: php seed_blogs.php
 */

require_once __DIR__ . '/database/db.php';
$pdo = getDB();

if (!$pdo) {
    die("Database connection failed\n");
}

$articles = [
    [
        'slug' => 'arsitektur-software-enterprise-monolith-vs-microservices',
        'title' => 'Arsitektur Software Enterprise: Memilih Modular Monolith vs Microservices di 2026',
        'description' => 'Panduan teknis mendalam untuk CTO dan software architect dalam memilih pola arsitektur yang tepat untuk aplikasi bisnis skala besar.',
        'service' => 'B',
        'serviceLabel' => 'Enterprise Architecture',
        'accent' => '#4f46e5',
        'accentLight' => '#eef2ff',
        'img' => '/assets/showcase2.webp',
        'faqs' => json_encode([
            [
                'q' => 'Kapan perusahaan harus memilih Modular Monolith dibanding Microservices?',
                'a' => 'Modular Monolith sangat disarankan jika tim developer kurang dari 30 orang, domain bisnis masih berkembang pesat, dan latensi jaringan antar-service ingin ditekan seminimal mungkin tanpa kompleksitas distributed tracing.'
            ],
            [
                'q' => 'Bagaimana transisi dari Monolith ke Microservices jika beban transaksi melonjak?',
                'a' => 'Gunakan pendekatan Strangler Fig Pattern dengan memisahkan domain yang memiliki frekuensi transaksi tertinggi terlebih dahulu ke service terisolasi dengan message broker seperti RabbitMQ atau Kafka.'
            ]
        ]),
        'content' => "## Paradoks Microservices di Dunia Enterprise\n\nBanyak tim engineering terjebak tren microservices terlalu dini. Akibatnya, mereka menukar masalah kode internal yang berantakan dengan masalah **network latency, distributed transaction failure, dan kompleksitas DevOps** yang jauh lebih mahal.\n\nDalam perancangan software enterprise di NurdiansyahLabs, kami selalu menekankan prinsip:\n> *\"Jangan distribusikan sistem Anda sampai batas performa in-memory dan database vertikal Anda benar-benar tercapai.\"*\n\n---\n\n## 1. Modular Monolith: Standar Emas untuk Mayoritas Bisnis\n\nModular Monolith bukan sekadar kode lama yang ditumpuk. Ini adalah aplikasi satu basis kode (*single deployable unit*) yang memiliki **batas domain yang ketat (bounded context)**.\n\n### Keunggulan Utama:\n- **Zero Network Overhead**: Pemanggilan antar modul dilakukan secara in-memory melalui function call internal, bukan HTTP/gRPC.\n- **Transaksi ACID Alami**: Transaksi database antar domain dapat dijalankan dalam satu blok database transaction tanpa Two-Phase Commit (2PC).\n- **Refactoring Cepat**: Mengubah struktur data antar modul sangat mudah tanpa risiko merusak API contract eksternal.\n\n```python\n# Contoh boundary modul internal pada Modular Monolith\nclass InventoryModule:\n    @staticmethod\n    def reserve_stock(sku: str, quantity: int) -> bool:\n        # Atomic lock di level database transaction\n        return db.session.execute(\"SELECT for_update...\")\n```\n\n---\n\n## 2. Kapan Microservices Benar-Benar Diperlukan?\n\nMicroservices menjadi pilihan rasional ketika:\n1. **Skalabilitas Independen**: Modul pemrosesan pembayaran atau analitik real-time membutuhkan CPU/RAM 50x lebih besar dibanding modul profil pengguna.\n2. **Struktur Tim**: Anda memiliki beberapa tim independen yang membutuhkan siklus deployment terpisah tanpa saling tunggu.\n3. **Teknologi Heterogen**: Modul computer vision membutuhkan Python/CUDA, sementara core API membutuhkan Go atau Node.js.\n\n---\n\n## 3. Checklist Keputusan Arsitektur\n\nSebelum memutuskan migrasi atau membangun sistem baru, pertimbangkan matriks berikut:\n\n| Kriteria | Modular Monolith | Distributed Microservices |\n| :--- | :--- | :--- |\n| **Ukuran Tim Dev** | 1 – 25 Engineer | 30+ Engineer multi-skuad |\n| **Biaya Infrastruktur** | Rendah – Menengah | Tinggi (K8s, mesh, APM) |\n| **Kompleksitas Observability**| Sederhana (Single Log) | Kompleks (Distributed Tracing) |\n| **Kecepatan Time-to-Market**| Sangat Cepat | Lebih Lambat di Awal |\n\nJika perusahaan Anda sedang merancang ulang sistem atau menghadapi kendala performa sistem lama, diskusikan arsitektur sistem bersama kami melalui [Konsultasi Arsitektur Software](/services/web-development)."
    ],
    [
        'slug' => 'panduan-full-sdlc-software-engineer-enterprise',
        'title' => 'Panduan Full SDLC: Metodologi Rekayasa Software Enterprise dari Analisis hingga Deployment',
        'description' => 'Langkah demi langkah menerapkan siklus hidup pengembangan perangkat lunak (SDLC) yang ketat untuk menjamin stabilitas dan keamanan produksi.',
        'service' => 'B',
        'serviceLabel' => 'Full SDLC Engineering',
        'accent' => '#0284c7',
        'accentLight' => '#e0f2fe',
        'img' => '/assets/showcase1.webp',
        'faqs' => json_encode([
            [
                'q' => 'Apa perbedaan web developer biasa dengan Full SDLC Software Engineer?',
                'a' => 'Web developer biasa umumnya hanya fokus pada tampilan UI atau coding endpoint. Full SDLC Software Engineer mengawal seluruh siklus: requirement engineering, domain modeling, arsitektur database, testing otomatis, CI/CD pipeline, hingga pemantauan server produksi.'
            ]
        ]),
        'content' => "## Mengapa Banyak Proyek Software Korporat Gagal?\n\nBerdasarkan studi industri rekayasa perangkat lunak, kegagalan proyek IT skala besar jarang disebabkan oleh bahasa pemrograman yang salah. Kegagalan hampir selalu berakar pada **ketiadaan disiplin Full SDLC (Software Development Life Cycle)**.\n\nDi NurdiansyahLabs, kami menerapkan 6 fase Full SDLC terstruktur untuk menjamin software enterprise yang aman, teruji, dan scalable:\n\n---\n\n## Fase 1: Domain Discovery & Architecture Blueprint\nTahap ini menentukan bagaimana model bisnis diterjemahkan menjadi arsitektur data.\n- **Domain-Driven Design (DDD)**: Memetakan proses bisnis, entitas, dan *ubiquitous language*.\n- **Database Schema Modeling**: Normalisasi 3NF untuk integritas transaksional, indexing strategis, dan proteksi foreign key constraints.\n- **API Contract Specification**: Menyusun spesifikasi OpenAPI/Swagger sebelum satu baris kode pun ditulis.\n\n---\n\n## Fase 2: Implementasi & Clean Architecture\nKode ditulis dengan pemisahan tanggung jawab yang tegas:\n- **Presentation Layer**: React / SPA modern dengan type-safety dan komponen modular.\n- **Business Domain Layer**: Logika inti bisnis yang murni, bebas dari ketergantungan framework.\n- **Infrastructure Layer**: Komunikasi database (PostgreSQL/MySQL), sistem antrian (Redis), dan integrasi pihak ketiga.\n\n---\n\n## Fase 3: Automated Testing Matrix\nSebuah software tidak boleh dianggap selesai sebelum lolos piramida pengujian otomatis:\n- **Unit Testing**: Menguji algoritma dan kalkulasi bisnis terisolasi.\n- **Integration Testing**: Memvalidasi interaksi antar query database dan relasi tabel.\n- **End-to-End (E2E) Testing**: Simulasi alur checkout dan transaksi pengguna secara otomatis.\n\n```bash\n# Menjalankan automated test suite sebelum integrasi CI/CD\nnpm run test:unit\npytest tests/integration/ --cov=app\n```\n\n---\n\n## Fase 4: Automated CI/CD & Zero-Downtime Deployment\nDeploy manual via FTP sudah usang dan berisiko tinggi. Kami mengotomatisasi:\n- **Automated Pipeline**: Linting, security scanning, dan test otomatis di setiap pull request.\n- **Blue/Green & Rolling Deployment**: Pembaruan versi aplikasi tanpa downtime sedetik pun bagi operasional bisnis.\n\nJika Anda membutuhkan partner engineering untuk memimpin proyek software enterprise Anda dari nol, pelajari alur kerja kami di [Layanan Rekayasa Sistem](/services/web-development)."
    ],
    [
        'slug' => 'migrasi-excel-ke-custom-erp-operasional',
        'title' => 'Kapan Perusahaan Harus Migrasi dari Spreadsheet & Excel ke Custom ERP Terintegrasi?',
        'description' => 'Tanda-tanda kritis saat spreadsheet mulai menghambat pertumbuhan bisnis, dan cara merancang custom ERP yang tepat sasaran.',
        'service' => 'B',
        'serviceLabel' => 'Enterprise ERP',
        'accent' => '#059669',
        'accentLight' => '#d1fae5',
        'img' => '/assets/showcase3.webp',
        'faqs' => json_encode([
            [
                'q' => 'Berapa lama proses pembuatan custom ERP?',
                'a' => 'Tergantung kompleksitas modul. MVP (Minimum Viable Product) untuk modul utama seperti stok dan POS biasanya memakan waktu 4-8 minggu, lalu dikembangkan bertahap.'
            ]
        ]),
        'content' => "## Spreadsheet adalah Alat Hebat, Tapi Punya Batas Kritis\n\nBanyak perusahaan bernilai miliaran rupiah masih mengelola stok gudang, pembukuan, dan transaksi cabang melalui ratusan file Excel yang dikirim lewat WhatsApp atau email.\n\nPada titik tertentu, ketergantungan ini berubah menjadi **bom waktu operasional**.\n\n---\n\n## 5 Tanda Anda Sudah Melebihi Kapasitas Spreadsheet:\n\n1. **Konflik Versi (*Version Hell*)**: Staf gudang dan tim kasir mengedit file berbeda, sehingga saldo inventori fisik berbeda dengan catatan buku.\n2. **Tidak Ada Audit Trail**: Ketika data transaksi terhapus atau berubah, Anda tidak bisa melacak siapa yang melakukannya dan kapan.\n3. **Pemuatan Lambat & Crash**: File Excel yang memiliki puluhan ribu baris dan rumus kompleks membutuhkan menit untuk dibuka dan rawan korup.\n4. **Data Silo**: Informasi keuangan tidak terhubung otomatis dengan stok barang atau riwayat pesanan klien.\n5. **Kebocoran Akses**: Sulit memberikan akses granular. Staf kasir bisa melihat data laporan laba rugi jika file dibagikan secara utuh.\n\n---\n\n## Solusi: Custom ERP Modular yang Disesuaikan dengan Bisnis Anda\n\nERP siap pakai (seperti SAP atau Odoo standar) sering kali terlalu kaku, mahal, dan memiliki ribuan fitur yang tidak terpakai oleh bisnis Anda.\n\nDi NurdiansyahLabs, kami merancang **Custom ERP Modular**:\n- Hanya membangun modul yang benar-benar Anda butuhkan (Inventory, POS Multi-cabang, Purchasing, Accounting).\n- Tampilan antarmuka yang intuitif dan cepat dipelajari oleh staf lapangan tanpa pelatihan berbulan-bulan.\n- Integrasi langsung dengan printer thermal, barcode scanner, dan dashboard mobile.\n\nLihat implementasi sistem nyata kami pada [Studi Kasus Primatera Poultry ERP](/showcase/fullstack/primatera-poultry) dan [LogiStack Warehouse WMS](/showcase/fullstack/warehouse-wms)."
    ],
    [
        'slug' => 'optimasi-database-postgresql-high-concurrency-transaksi',
        'title' => 'Optimasi Database PostgreSQL untuk Sistem Transaksi High-Concurrency',
        'description' => 'Teknik engineering untuk mencegah deadlocks, table bloat, dan bottleneck performa pada database aplikasi enterprise.',
        'service' => 'B',
        'serviceLabel' => 'Database Architecture',
        'accent' => '#0891b2',
        'accentLight' => '#cffafe',
        'img' => '/assets/showcase1.webp',
        'faqs' => json_encode([]),
        'content' => "## Mengapa Query Cepat di Local Menjadi Lambat di Produksi?\n\nSaat aplikasi diuji di laptop developer dengan 10 transaksi dummy, semua query terasa instan. Namun ketika dilepas ke produksi dengan ratusan pengguna bersamaan (*concurrent users*), database tiba-tiba mengalami **CPU spike 100%, connection pool timeout, dan transaksi terkunci (deadlock)**.\n\nBerikut adalah strategi rekayasa database yang kami terapkan untuk sistem enterprise:\n\n---\n\n## 1. Indexing yang Efektif, Bukan Berlebihan\nMenambahkan index pada setiap kolom justru memperlambat operasi `INSERT` dan `UPDATE` karena engine database harus memperbarui pohon B-Tree di setiap perubahan.\n\n- **Covering Index**: Gunakan index gabungan (`composite index`) yang mengcover clause `WHERE` sekaligus `ORDER BY`.\n- **Partial Index**: Jika Anda hanya mencari data dengan status tertentu, index data tersebut saja:\n\n```sql\n-- Menghemat 90% ukuran index untuk order yang aktif saja\nCREATE INDEX idx_orders_active ON orders (customer_id, created_at)\nWHERE status IN ('PENDING', 'PROCESSING');\n```\n\n---\n\n## 2. Mengatasi Row Contention & Deadlock\nDalam sistem penjualan cepat (flash sale atau kasir grosir), pengurangan kuantitas stok produk yang sama oleh 100 kasir sekaligus akan menyebabkan antrian lock yang parah.\n\nGunakan teknik optimasi baris:\n- **Pessimistic Locking dengan Timeout**: `SELECT ... FOR UPDATE NOWAIT` untuk mencegah thread terkatung-katung.\n- **Connection Pooling Terdistribusi**: Pasang connection pooler seperti **PgBouncer** untuk membatasi overhead pembuatan thread PostgreSQL baru.\n\nPelajari bagaimana kami mengintegrasikan arsitektur database berkinerja tinggi dalam layanan kami di [Arsitektur & Konsultasi Teknis](/services/web-development)."
    ],
    [
        'slug' => 'studi-kasus-arsitektur-wms-pos-terdistribusi',
        'title' => 'Studi Kasus: Arsitektur WMS & POS Terdistribusi untuk Bisnis Multi-Cabang',
        'description' => 'Bedah arsitektur nyata sistem inventori dan kasir terintegrasi yang mampu beroperasi offline-first dan sinkronisasi real-time.',
        'service' => 'B',
        'serviceLabel' => 'Case Study',
        'accent' => '#d97706',
        'accentLight' => '#fef3c7',
        'img' => '/assets/showcase2.webp',
        'faqs' => json_encode([]),
        'content' => "## Tantangan Lapangan: Internet Cabang yang Fluktuatif\n\nPada operasional bisnis multi-cabang (ritel, agrikultur, gudang logistik), koneksi internet di lokasi lapangan sering kali tidak stabil. Jika POS kasir atau scan barcode bergantung 100% pada API cloud terpusat, antrian pelanggan akan macet seketika saat jaringan terputus.\n\n---\n\n## Solusi Arsitektur: Offline-First Hybrid Architecture\n\nKami merancang arsitektur terdistribusi dengan prinsip:\n1. **Local State Engine**: Di cabang lokal, aplikasi menyimpan transaksi ke IndexedDB / SQLite lokal dengan serialisasi UUID v4. Kasir tetap bisa mencetak struk dan melakukan penjualan tanpa internet.\n2. **Event Sourcing & Queue Sync**: Begitu koneksi internet pulih, background worker mengirim mutasi data dalam format batch ke cloud server.\n3. **Conflict Resolution Strategy**: Logika rekonsiliasi data otomatis berbasis timestamp dan event sequencing untuk mencegah selisih stok.\n\nPelajari demo interaktif dari sistem ini di [Showcase Koperasi POS](/showcase/fullstack/koperasi-pos) dan [LogiStack WMS](/showcase/fullstack/warehouse-wms)."
    ]
];

$sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, img, faqs, content) 
        VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :img, :faqs, :content)
        ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            description = VALUES(description),
            serviceLabel = VALUES(serviceLabel),
            accent = VALUES(accent),
            accentLight = VALUES(accentLight),
            img = VALUES(img),
            faqs = VALUES(faqs),
            content = VALUES(content)";

$stmt = $pdo->prepare($sql);
$success = 0;

foreach ($articles as $article) {
    try {
        $stmt->execute($article);
        $success++;
        echo "✅ Synced: {$article['title']}\n";
    } catch (Exception $e) {
        echo "❌ Error on {$article['title']}: " . $e->getMessage() . "\n";
    }
}

echo "\n🚀 Selesai: $success artikel enterprise berhasil disinkronkan ke database!\n";
?>