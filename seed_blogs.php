<?php
require_once __DIR__ . '/database/db.php';
$pdo = getDB();

if (!$pdo) {
    die("Database connection failed\n");
}

$articles = [
    // CLUSTER 1: The Data-Driven Business (Data Analyst / ML)
    [
        'slug' => 'panduan-data-bisnis-umkm',
        'title' => 'Panduan Ultimate: Menggunakan Data Bisnis untuk UMKM',
        'description' => 'Bagaimana UMKM dapat memanfaatkan analisis data dan machine learning untuk melipatgandakan keuntungan.',
        'service' => 'C',
        'serviceLabel' => 'Data Analyst',
        'accent' => '#059669',
        'accentLight' => '#d1fae5',
        'images' => '["/assets/showcase1.webp"]',
        'faqs' => json_encode([
            ["q" => "Apakah UMKM butuh data analyst?", "a" => "Sangat butuh. Data membantu mengurangi tebakan dalam bisnis."],
            ["q" => "Tools apa yang digunakan?", "a" => "Mulai dari Excel, Google Looker, hingga Tableau dan Power BI."]
        ]),
        'content' => "## Kenapa UMKM Membutuhkan Analisis Data?\n\nBanyak pemilik bisnis kecil merasa bahwa *Data Science* atau *Data Analytics* hanyalah untuk perusahaan besar. Faktanya, menganalisis data penjualan harian Anda bisa mengungkap:\n- Menu atau produk mana yang memberikan margin tertinggi\n- Kapan waktu tersibuk toko Anda\n- Siapa pelanggan paling loyal Anda\n\n### Langkah 1: Kumpulkan Data Anda\nMulai dari sistem kasir (POS), data transaksi WhatsApp, atau bahkan pencatatan manual di Excel.\n\n### Langkah 2: Visualisasi\nKami di NurdiansyahLabs membantu merubah ribuan baris Excel Anda menjadi satu Dashboard interaktif. Anda bisa melihat tren naik-turunnya bisnis hanya dari HP Anda.\n\n[Hubungi kami untuk pembuatan Dashboard Bisnis](/service)"
    ],
    [
        'slug' => 'excel-vs-tableau-vs-powerbi',
        'title' => 'Excel vs Tableau vs Power BI: Mana yang Terbaik?',
        'description' => 'Perbandingan lengkap tools analitik untuk bisnis Anda.',
        'service' => 'C',
        'serviceLabel' => 'Data Analyst',
        'accent' => '#059669',
        'accentLight' => '#d1fae5',
        'images' => '["/assets/showcase1.webp"]',
        'faqs' => json_encode([]),
        'content' => "Excel adalah raja untuk perhitungan cepat, tapi jika data Anda melebihi 100.000 baris, Excel akan melambat.\n\n**Power BI** sangat cocok jika Anda sudah menggunakan ekosistem Microsoft, sedangkan **Tableau** unggul di visualisasi yang kompleks.\n\nBingung memilih? Kami dapat membangun infrastruktur data Anda menggunakan tool yang paling tepat sasaran."
    ],
    // CLUSTER 2: Web Performance & Conversion (Landing Pages / Fullstack)
    [
        'slug' => 'panduan-website-konversi-tinggi',
        'title' => 'Cara Membangun Website dengan Konversi Tinggi di 2026',
        'description' => 'Strategi lengkap merubah pengunjung website menjadi pelanggan setia.',
        'service' => 'A',
        'serviceLabel' => 'Landing Page',
        'accent' => '#2563eb',
        'accentLight' => '#dbeafe',
        'images' => '["/assets/showcase2.webp"]',
        'faqs' => json_encode([
            ["q" => "Berapa lama buat landing page?", "a" => "Biasanya 3-7 hari kerja."]
        ]),
        'content' => "## Kecepatan adalah Kunci\n\nJika website Anda memuat lebih dari 3 detik, 50% pengunjung akan pergi. Inilah alasan mengapa kami membangun Landing Page menggunakan **React dan Vite** alih-alih WordPress biasa.\n\n### Struktur yang Menjual\n1. **Headline yang jelas:** Jangan bertele-tele, langsung sampaikan apa untungnya bagi mereka.\n2. **Social Proof:** Tampilkan testimoni atau logo klien.\n3. **Call to Action (CTA):** Gunakan tombol WhatsApp yang melayang agar mudah dihubungi."
    ],
    [
        'slug' => 'perbedaan-landing-page-dan-fullstack',
        'title' => 'Landing Page vs Fullstack Web App: Mana yang Anda Butuhkan?',
        'description' => 'Jangan salah investasi. Kenali perbedaan mendasar antara landing page dan web app.',
        'service' => 'B',
        'serviceLabel' => 'Fullstack Web',
        'accent' => '#7c3aed',
        'accentLight' => '#ede9fe',
        'images' => '["/assets/showcase3.webp"]',
        'faqs' => json_encode([]),
        'content' => "Jika Anda hanya ingin mempromosikan jasa atau produk dan mengarahkan orang ke WhatsApp, Anda butuh **Landing Page**.\n\nTapi, jika Anda butuh fitur login user, keranjang belanja, integrasi payment gateway, atau dashboard admin, maka Anda membutuhkan **Fullstack Web App**.\n\nNurdiansyahLabs melayani keduanya dengan arsitektur yang bisa di-scale up kapan saja."
    ]
];

$sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content) 
        VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :images, :faqs, :content)";
$stmt = $pdo->prepare($sql);

$inserted = 0;
foreach ($articles as $article) {
    try {
        $stmt->execute($article);
        $inserted++;
        echo "Inserted: " . $article['title'] . "\n";
    } catch (Exception $e) {
        echo "Skipped (already exists?): " . $article['title'] . "\n";
    }
}
echo "\nTotal inserted: $inserted\n";
?>
