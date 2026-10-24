/**
 * NurdiansyahLabs – Curated Technical Articles & Fallback Blog Data
 * Ensures instant SSR, zero-blank state, and rich search engine indexability
 * for Enterprise Software Engineering & Full SDLC topics.
 */

export const INITIAL_BLOG_POSTS = [
    {
        id: 'post-1',
        slug: 'arsitektur-software-enterprise-monolith-vs-microservices',
        title: 'Arsitektur Software Enterprise: Memilih Modular Monolith vs Microservices di 2026',
        description: 'Panduan teknis mendalam untuk CTO dan software architect dalam memilih pola arsitektur yang tepat untuk aplikasi bisnis skala besar.',
        excerpt: 'Panduan teknis mendalam untuk CTO dan software architect dalam memilih pola arsitektur yang tepat untuk aplikasi bisnis skala besar.',
        category: 'Arsitektur Sistem',
        serviceLabel: 'Enterprise Architecture',
        tags: ['Architecture', 'Monolith', 'Microservices', 'Enterprise'],
        accent: '#4f46e5',
        accentLight: '#eef2ff',
        author: 'Nurdiansyah',
        authorRole: 'Enterprise Software Engineer & Systems Architect',
        publishedAt: '2026-03-15',
        readTime: '7 min baca',
        img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
        faqs: [
            {
                q: 'Kapan perusahaan harus memilih Modular Monolith dibanding Microservices?',
                a: 'Modular Monolith sangat disarankan jika tim developer kurang dari 30 orang, domain bisnis masih berkembang pesat, dan latensi jaringan antar-service ingin ditekan seminimal mungkin tanpa kompleksitas distributed tracing.'
            },
            {
                q: 'Bagaimana transisi dari Monolith ke Microservices jika beban transaksi melonjak?',
                a: 'Gunakan pendekatan Strangler Fig Pattern dengan memisahkan domain yang memiliki frekuensi transaksi tertinggi terlebih dahulu ke service terisolasi dengan message broker seperti RabbitMQ atau Kafka.'
            }
        ],
        content: `## Paradoks Microservices di Dunia Enterprise

Banyak tim engineering terjebak tren microservices terlalu dini. Akibatnya, mereka menukar masalah kode internal yang berantakan dengan masalah **network latency, distributed transaction failure, dan kompleksitas DevOps** yang jauh lebih mahal.

Dalam perancangan software enterprise di NurdiansyahLabs, kami selalu menekankan prinsip:
> *"Jangan distribusikan sistem Anda sampai batas performa in-memory dan database vertikal Anda benar-benar tercapai."*

---

## 1. Modular Monolith: Standar Emas untuk Mayoritas Bisnis

Modular Monolith bukan sekadar kode lama yang ditumpuk. Ini adalah aplikasi satu basis kode (*single deployable unit*) yang memiliki **batas domain yang ketat (bounded context)**.

### Keunggulan Utama:
- **Zero Network Overhead**: Pemanggilan antar modul dilakukan secara in-memory melalui function call internal, bukan HTTP/gRPC.
- **Transaksi ACID Alami**: Transaksi database antar domain dapat dijalankan dalam satu blok database transaction tanpa Two-Phase Commit (2PC).
- **Refactoring Cepat**: Mengubah struktur data antar modul sangat mudah tanpa risiko merusak API contract eksternal.

\`\`\`python
# Contoh boundary modul internal pada Modular Monolith
class InventoryModule:
    @staticmethod
    def reserve_stock(sku: str, quantity: int) -> bool:
        # Atomic lock di level database transaction
        return db.session.execute("SELECT for_update...")
\`\`\`

---

## 2. Kapan Microservices Benar-Benar Diperlukan?

Microservices menjadi pilihan rasional ketika:
1. **Skalabilitas Independen**: Modul pemrosesan pembayaran atau analitik real-time membutuhkan CPU/RAM 50x lebih besar dibanding modul profil pengguna.
2. **Struktur Tim**: Anda memiliki beberapa tim independen yang membutuhkan siklus deployment terpisah tanpa saling tunggu.
3. **Teknologi Heterogen**: Modul computer vision membutuhkan Python/CUDA, sementara core API membutuhkan Go atau Node.js.

---

## 3. Checklist Keputusan Arsitektur

Sebelum memutuskan migrasi atau membangun sistem baru, pertimbangkan matriks berikut:

| Kriteria | Modular Monolith | Distributed Microservices |
| :--- | :--- | :--- |
| **Ukuran Tim Dev** | 1 – 25 Engineer | 30+ Engineer multi-skuad |
| **Biaya Infrastruktur** | Rendah – Menengah | Tinggi (K8s, mesh, APM) |
| **Kompleksitas Observability**| Sederhana (Single Log) | Kompleks (Distributed Tracing) |
| **Kecepatan Time-to-Market**| Sangat Cepat | Lebih Lambat di Awal |

Jika perusahaan Anda sedang merancang ulang sistem atau menghadapi kendala performa sistem lama, diskusikan arsitektur sistem bersama kami melalui [Konsultasi Arsitektur Software](/services/web-development).`
    },
    {
        id: 'post-2',
        slug: 'panduan-full-sdlc-software-engineer-enterprise',
        title: 'Panduan Full SDLC: Metodologi Rekayasa Software Enterprise dari Analisis hingga Deployment',
        description: 'Langkah demi langkah menerapkan siklus hidup pengembangan perangkat lunak (SDLC) yang ketat untuk menjamin stabilitas dan keamanan produksi.',
        excerpt: 'Langkah demi langkah menerapkan siklus hidup pengembangan perangkat lunak (SDLC) yang ketat untuk menjamin stabilitas dan keamanan produksi.',
        category: 'Full SDLC',
        serviceLabel: 'Full SDLC Engineering',
        tags: ['SDLC', 'SoftwareEngineering', 'DevOps', 'CI/CD'],
        accent: '#0284c7',
        accentLight: '#e0f2fe',
        author: 'Nurdiansyah',
        authorRole: 'Enterprise Software Engineer & Systems Architect',
        publishedAt: '2026-03-20',
        readTime: '9 min baca',
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
        faqs: [
            {
                q: 'Apa perbedaan web developer biasa dengan Full SDLC Software Engineer?',
                a: 'Web developer biasa umumnya hanya fokus pada tampilan UI atau coding endpoint. Full SDLC Software Engineer mengawal seluruh siklus: requirement engineering, domain modeling, arsitektur database, testing otomatis, CI/CD pipeline, hingga pemantauan server produksi.'
            }
        ],
        content: `## Mengapa Banyak Proyek Software Korporat Gagal?

Berdasarkan studi industri rekayasa perangkat lunak, kegagalan proyek IT skala besar jarang disebabkan oleh bahasa pemrograman yang salah. Kegagalan hampir selalu berakar pada **ketiadaan disiplin Full SDLC (Software Development Life Cycle)**.

Di NurdiansyahLabs, kami menerapkan 6 fase Full SDLC terstruktur untuk menjamin software enterprise yang aman, teruji, dan scalable:

---

## Fase 1: Domain Discovery & Architecture Blueprint
Tahap ini menentukan bagaimana model bisnis diterjemahkan menjadi arsitektur data.
- **Domain-Driven Design (DDD)**: Memetakan proses bisnis, entitas, dan *ubiquitous language*.
- **Database Schema Modeling**: Normalisasi 3NF untuk integritas transaksional, indexing strategis, dan proteksi foreign key constraints.
- **API Contract Specification**: Menyusun spesifikasi OpenAPI/Swagger sebelum satu baris kode pun ditulis.

---

## Fase 2: Implementasi & Clean Architecture
Kode ditulis dengan pemisahan tanggung jawab yang tegas:
- **Presentation Layer**: React / SPA modern dengan type-safety dan komponen modular.
- **Business Domain Layer**: Logika inti bisnis yang murni, bebas dari ketergantungan framework.
- **Infrastructure Layer**: Komunikasi database (PostgreSQL/MySQL), sistem antrian (Redis), dan integrasi pihak ketiga.

---

## Fase 3: Automated Testing Matrix
Sebuah software tidak boleh dianggap selesai sebelum lolos piramida pengujian otomatis:
- **Unit Testing**: Menguji algoritma dan kalkulasi bisnis terisolasi.
- **Integration Testing**: Memvalidasi interaksi antar query database dan relasi tabel.
- **End-to-End (E2E) Testing**: Simulasi alur checkout dan transaksi pengguna secara otomatis.

\`\`\`bash
# Menjalankan automated test suite sebelum integrasi CI/CD
npm run test:unit
pytest tests/integration/ --cov=app
\`\`\`

---

## Fase 4: Automated CI/CD & Zero-Downtime Deployment
Deploy manual via FTP sudah usang dan berisiko tinggi. Kami mengotomatisasi:
- **Automated Pipeline**: Linting, security scanning, dan test otomatis di setiap pull request.
- **Blue/Green & Rolling Deployment**: Pembaruan versi aplikasi tanpa downtime sedetik pun bagi operasional bisnis.

Jika Anda membutuhkan partner engineering untuk memimpin proyek software enterprise Anda dari nol, pelajari alur kerja kami di [Layanan Rekayasa Sistem](/services/web-development).`
    },
    {
        id: 'post-3',
        slug: 'migrasi-excel-ke-custom-erp-operasional',
        title: 'Kapan Perusahaan Harus Migrasi dari Spreadsheet & Excel ke Custom ERP Terintegrasi?',
        description: 'Tanda-tanda kritis saat spreadsheet mulai menghambat pertumbuhan bisnis, dan cara merancang custom ERP yang tepat sasaran.',
        excerpt: 'Tanda-tanda kritis saat spreadsheet mulai menghambat pertumbuhan bisnis, dan cara merancang custom ERP yang tepat sasaran.',
        category: 'Sistem ERP',
        serviceLabel: 'Enterprise ERP',
        tags: ['ERP', 'Automation', 'CustomSoftware', 'Operations'],
        accent: '#059669',
        accentLight: '#d1fae5',
        author: 'Nurdiansyah',
        authorRole: 'Enterprise Software Engineer & Systems Architect',
        publishedAt: '2026-03-25',
        readTime: '6 min baca',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
        faqs: [
            {
                q: 'Berapa lama proses pembuatan custom ERP?',
                a: 'Tergantung kompleksitas modul. MVP (Minimum Viable Product) untuk modul utama seperti stok dan POS biasanya memakan waktu 4-8 minggu, lalu dikembangkan bertahap.'
            }
        ],
        content: `## Spreadsheet adalah Alat Hebat, Tapi Punya Batas Kritis

Banyak perusahaan bernilai miliaran rupiah masih mengelola stok gudang, pembukuan, dan transaksi cabang melalui ratusan file Excel yang dikirim lewat WhatsApp atau email.

Pada titik tertentu, ketergantungan ini berubah menjadi **bom waktu operasional**.

---

## 5 Tanda Anda Sudah Melebihi Kapasitas Spreadsheet:

1. **Konflik Versi (*Version Hell*)**: Staf gudang dan tim kasir mengedit file berbeda, sehingga saldo inventori fisik berbeda dengan catatan buku.
2. **Tidak Ada Audit Trail**: Ketika data transaksi terhapus atau berubah, Anda tidak bisa melacak siapa yang melakukannya dan kapan.
3. **Pemuatan Lambat & Crash**: File Excel yang memiliki puluhan ribu baris dan rumus kompleks membutuhkan menit untuk dibuka dan rawan korup.
4. **Data Silo**: Informasi keuangan tidak terhubung otomatis dengan stok barang atau riwayat pesanan klien.
5. **Kebocoran Akses**: Sulit memberikan akses granular. Staf kasir bisa melihat data laporan laba rugi jika file dibagikan secara utuh.

---

## Solusi: Custom ERP Modular yang Disesuaikan dengan Bisnis Anda

ERP siap pakai (seperti SAP atau Odoo standar) sering kali terlalu kaku, mahal, dan memiliki ribuan fitur yang tidak terpakai oleh bisnis Anda.

Di NurdiansyahLabs, kami merancang **Custom ERP Modular**:
- Hanya membangun modul yang benar-benar Anda butuhkan (Inventory, POS Multi-cabang, Purchasing, Accounting).
- Tampilan antarmuka yang intuitif dan cepat dipelajari oleh staf lapangan tanpa pelatihan berbulan-bulan.
- Integrasi langsung dengan printer thermal, barcode scanner, dan dashboard mobile.

Lihat implementasi sistem nyata kami pada [Studi Kasus Primatera Poultry ERP](/showcase/fullstack/primatera-poultry) dan [LogiStack Warehouse WMS](/showcase/fullstack/warehouse-wms).`
    },
    {
        id: 'post-4',
        slug: 'optimasi-database-postgresql-high-concurrency-transaksi',
        title: 'Optimasi Database PostgreSQL untuk Sistem Transaksi High-Concurrency',
        description: 'Teknik engineering untuk mencegah deadlocks, table bloat, dan bottleneck performa pada database aplikasi enterprise.',
        excerpt: 'Teknik engineering untuk mencegah deadlocks, table bloat, dan bottleneck performa pada database aplikasi enterprise.',
        category: 'Database & Cloud',
        serviceLabel: 'Database Architecture',
        tags: ['PostgreSQL', 'HighConcurrency', 'DatabaseOptimization', 'Indexing'],
        accent: '#0891b2',
        accentLight: '#cffafe',
        author: 'Nurdiansyah',
        authorRole: 'Enterprise Software Engineer & Systems Architect',
        publishedAt: '2026-04-01',
        readTime: '8 min baca',
        img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&auto=format&fit=crop&q=80',
        faqs: [],
        content: `## Mengapa Query Cepat di Local Menjadi Lambat di Produksi?

Saat aplikasi diuji di laptop developer dengan 10 transaksi dummy, semua query terasa instan. Namun ketika dilepas ke produksi dengan ratusan pengguna bersamaan (*concurrent users*), database tiba-tiba mengalami **CPU spike 100%, connection pool timeout, dan transaksi terkunci (deadlock)**.

Berikut adalah strategi rekayasa database yang kami terapkan untuk sistem enterprise:

---

## 1. Indexing yang Efektif, Bukan Berlebihan
Menambahkan index pada setiap kolom justru memperlambat operasi \`INSERT\` dan \`UPDATE\` karena engine database harus memperbarui pohon B-Tree di setiap perubahan.

- **Covering Index**: Gunakan index gabungan (\`composite index\`) yang mengcover clause \`WHERE\` sekaligus \`ORDER BY\`.
- **Partial Index**: Jika Anda hanya mencari data dengan status tertentu, index data tersebut saja:

\`\`\`sql
-- Menghemat 90% ukuran index untuk order yang aktif saja
CREATE INDEX idx_orders_active ON orders (customer_id, created_at)
WHERE status IN ('PENDING', 'PROCESSING');
\`\`\`

---

## 2. Mengatasi Row Contention & Deadlock
Dalam sistem penjualan cepat (flash sale atau kasir grosir), pengurangan kuantitas stok produk yang sama oleh 100 kasir sekaligus akan menyebabkan antrian lock yang parah.

Gunakan teknik optimasi baris:
- **Pessimistic Locking dengan Timeout**: \`SELECT ... FOR UPDATE NOWAIT\` untuk mencegah thread terkatung-katung.
- **Connection Pooling Terdistribusi**: Pasang connection pooler seperti **PgBouncer** untuk membatasi overhead pembuatan thread PostgreSQL baru.

Pelajari bagaimana kami mengintegrasikan arsitektur database berkinerja tinggi dalam layanan kami di [Arsitektur & Konsultasi Teknis](/services/web-development).`
    },
    {
        id: 'post-5',
        slug: 'studi-kasus-arsitektur-wms-pos-terdistribusi',
        title: 'Studi Kasus: Arsitektur WMS & POS Terdistribusi untuk Bisnis Multi-Cabang',
        description: 'Bedah arsitektur nyata sistem inventori dan kasir terintegrasi yang mampu beroperasi offline-first dan sinkronisasi real-time.',
        excerpt: 'Bedah arsitektur nyata sistem inventori dan kasir terintegrasi yang mampu beroperasi offline-first dan sinkronisasi real-time.',
        category: 'Studi Kasus',
        serviceLabel: 'Case Study',
        tags: ['CaseStudy', 'WMS', 'POS', 'DistributedSystems'],
        accent: '#d97706',
        accentLight: '#fef3c7',
        author: 'Nurdiansyah',
        authorRole: 'Enterprise Software Engineer & Systems Architect',
        publishedAt: '2026-04-05',
        readTime: '10 min baca',
        img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
        faqs: [],
        content: `## Tantangan Lapangan: Internet Cabang yang Fluktuatif

Pada operasional bisnis multi-cabang (ritel, agrikultur, gudang logistik), koneksi internet di lokasi lapangan sering kali tidak stabil. Jika POS kasir atau scan barcode bergantung 100% pada API cloud terpusat, antrian pelanggan akan macet seketika saat jaringan terputus.

---

## Solusi Arsitektur: Offline-First Hybrid Architecture

Kami merancang arsitektur terdistribusi dengan prinsip:
1. **Local State Engine**: Di cabang lokal, aplikasi menyimpan transaksi ke IndexedDB / SQLite lokal dengan serialisasi UUID v4. Kasir tetap bisa mencetak struk dan melakukan penjualan tanpa internet.
2. **Event Sourcing & Queue Sync**: Begitu koneksi internet pulih, background worker mengirim mutasi data dalam format batch ke cloud server.
3. **Conflict Resolution Strategy**: Logika rekonsiliasi data otomatis berbasis timestamp dan event sequencing untuk mencegah selisih stok.

Pelajari demo interaktif dari sistem ini di [Showcase Koperasi POS](/showcase/fullstack/koperasi-pos) dan [LogiStack WMS](/showcase/fullstack/warehouse-wms).`
    }
];

export function getFallbackPost(slug) {
    if (!slug) return null;
    const cleanSlug = slug.replace(/^.*\//, ''); // handle nested geo or prefix
    return INITIAL_BLOG_POSTS.find(p => p.slug === cleanSlug || p.slug === slug) || null;
}

export const BLOG_POSTS = INITIAL_BLOG_POSTS;
