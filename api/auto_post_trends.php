<?php
/**
 * NurdiansyahLabs – Autonomous SEO Content Generator
 * Deployed at: /public_html/api/auto_post_trends.php
 * 
 * Fetches the #1 highest-opportunity keyword from Google Trends (via trends.php),
 * generates a fully-optimized SEO article via Pollinations AI (keyless, free),
 * and directly inserts it into the NurdiansyahLabs MySQL database.
 * 
 * Run this via cron job: `0 8,20 * * * php /home/uygpuazs/public_html/api/auto_post_trends.php`
 */

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    die("Database connection failed\n");
}

// Ensure images column exists
try {
    $pdo->query("SELECT images FROM posts LIMIT 1");
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Unknown column') !== false) {
        try {
            $pdo->exec("ALTER TABLE posts ADD COLUMN images JSON NULL AFTER img");
        } catch (Exception $ex) {}
    }
}

// 1. Fetch #1 Opportunity from local trends API
$ch = curl_init('https://nurdiansyahlabs.com/api/trends.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$trendsData = curl_exec($ch);


$trends = json_decode($trendsData, true);

if (empty($trends['top10'])) {
    die("No trends available\n");
}

$topTrend = $trends['top10'][0];
$keyword = $topTrend['keyword'];
$service = $topTrend['service'];
$serviceLabel = $topTrend['serviceLabel'];

// 2. Check if we already wrote an article for this keyword today
$slug = str_replace(' ', '-', strtolower($keyword));
$stmt = $pdo->prepare("SELECT id FROM posts WHERE slug = :slug");
$stmt->execute(['slug' => $slug]);
if ($stmt->fetch()) {
    die("Article for '{$keyword}' already exists. Skipping.\n");
}

// 3. Generate Content via Pollinations AI
echo "Generating article for: {$keyword}...\n";

// Craft a strict prompt to ensure high-quality Indonesian SEO content
$prompt = "Tulis artikel SEO 800 kata dalam bahasa Indonesia tentang '{$keyword}'. 
Konteks: Ini untuk blog 'NurdiansyahLabs' yang menawarkan jasa {$serviceLabel}. 
Struktur:
1. Judul H1 menarik (maks 60 karakter)
2. Paragraf pembuka (pancingan, masalah, solusi)
3. H2: Kenapa {$keyword} penting di 2026?
4. H2: 3 Tips Utama (berikan data atau contoh relevan)
5. H2: Bagaimana NurdiansyahLabs Bisa Membantu? (Soft selling jasa {$serviceLabel})
Gunakan format HTML murni (tanpa tag html/body, langsung h1, p, h2, ul, li). Jangan gunakan Markdown.
Pastikan paragraf pendek dan mudah dibaca.";

$aiUrl = 'https://text.pollinations.ai/' . urlencode($prompt);
$ch = curl_init($aiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'NurdiansyahLabs-SEO-Bot/1.0');
$content = curl_exec($ch);


if (empty($content) || strlen($content) < 500) {
    die("Failed to generate sufficient content from Pollinations AI\n");
}

// 4. Extract H1 for the Title, and generate a Meta Description
preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $content, $h1Matches);
$title = $h1Matches[1] ?? ucfirst($keyword) . " - Tren & Wawasan Terbaru";
$title = strip_tags($title);

// Clean up H1 from content (since the React frontend displays its own H1)
$content = preg_replace('/<h1[^>]*>.*?<\/h1>/is', '', $content, 1);

// Generate 150 char meta description from the first paragraph
preg_match('/<p[^>]*>(.*?)<\/p>/is', $content, $pMatches);
$description = $pMatches[1] ?? "Pelajari lebih lanjut tentang {$keyword} dan bagaimana ini dapat mengubah strategi bisnis digital Anda bersama NurdiansyahLabs.";
$description = strip_tags($description);
if (strlen($description) > 150) {
    $description = substr($description, 0, 147) . '...';
}

// 5. Generate 2 FAQs based on the keyword
$faqs = [
    [
        "question" => "Apa itu {$keyword}?",
        "answer" => "{$keyword} adalah salah satu tren utama dalam industri digital saat ini yang berfokus pada optimasi dan efisiensi melalui layanan {$serviceLabel}."
    ],
    [
        "question" => "Mengapa saya butuh jasa {$serviceLabel} untuk ini?",
        "answer" => "Dengan bantuan profesional dari NurdiansyahLabs, Anda tidak perlu membuang waktu dan biaya untuk trial & error. Kami memiliki framework teruji untuk {$keyword}."
    ]
];

// Fallback images based on service
$images = [
    'A' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // Landing Page
    'B' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', // Fullstack
    'C' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // Data Analyst
    'D' => 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80', // Data Science
];
$imgUrl = $images[$service] ?? $images['A'];

$placeholderImages = [
    [
        "url" => $imgUrl,
        "is_primary" => true
    ]
];

// 6. Insert into Database
// Try INSERT with images column first
try {
    $sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content) 
            VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :images, :faqs, :content)";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'slug' => $slug,
        'title' => $title,
        'description' => $description,
        'service' => $service,
        'serviceLabel' => $serviceLabel,
        'accent' => '#92400e', // Hardcoded high-contrast dark amber
        'accentLight' => '#fef3c7',
        'images' => json_encode($placeholderImages),
        'faqs' => json_encode($faqs),
        'content' => $content
    ]);
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Unknown column') !== false) {
        // Fallback to img column
        $sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, img, faqs, content) 
                VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :img, :faqs, :content)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'slug' => $slug,
            'title' => $title,
            'description' => $description,
            'service' => $service,
            'serviceLabel' => $serviceLabel,
            'accent' => '#92400e',
            'accentLight' => '#fef3c7',
            'img' => $imgUrl,
            'faqs' => json_encode($faqs),
            'content' => $content
        ]);
    } else {
        throw $e;
    }
}

echo "✅ Successfully published: {$title}\n";
