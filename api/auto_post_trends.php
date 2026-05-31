<?php
/**
 * NurdiansyahLabs – Google Trends Auto-Blogger (Growth Hack)
 * Deployed at: /public_html/api/auto_post_trends.php
 * 
 * Scrapes Google Trends ID RSS, Extracts #1 Keyword, Generates a 5-paragraph
 * SEO-optimized article injecting the keyword, and inserts it into MySQL.
 */

header('Content-Type: application/json');

// ── Security Protocol (Optional: Protect endpoint so only Cron/Admin runs it) ──
$secretCronKey = 'nurdiansyah-cron-2026'; // e.g. /api/auto_post_trends.php?key=...
if (isset($_GET['key']) && $_GET['key'] !== $secretCronKey) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden Access']);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// ── 1. G20 Geography Definitions & Dynamic RSS ────────────────────────────────
$geoRaw = isset($_GET['geo']) ? strtoupper($_GET['geo']) : 'US'; // Default to US if not provided

$g20_map = [
    'US' => ['lang' => 'en', 'label' => 'English'],
    'GB' => ['lang' => 'en', 'label' => 'English'],
    'ID' => ['lang' => 'id', 'label' => 'Indonesian'],
    'JP' => ['lang' => 'ja', 'label' => 'Japanese'],
    'DE' => ['lang' => 'en', 'label' => 'English'],     // Fallback to EN if language not mapped
    'AU' => ['lang' => 'en', 'label' => 'English'],
];

// Fallback to default if somehow an invalid geo provided
$geoValid = array_key_exists($geoRaw, $g20_map) ? $geoRaw : 'US';
$targetLang = $g20_map[$geoValid]['lang'];
$targetLangLabel = $g20_map[$geoValid]['label'];

$rssUrl = "https://trends.google.com/trending/rss?geo=" . $geoValid;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $rssUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Spoof as a real browser
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
// Bypass strict SSL verification for local dev environments
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

$rssContent = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!$rssContent || $httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch Google Trends XML (HTTP ' . $httpCode . ')']);
    exit;
}

$xml = simplexml_load_string($rssContent);
if (!$xml) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse XML']);
    exit;
}

// Register the strict RSS namespace for 'ht' nodes
$xml->registerXPathNamespace('ht', 'https://trends.google.com/trending/rss');

// Extract the absolute #1 highest volume keyword of the day
$topItem = $xml->channel->item[0]; // RSS feeds use <channel><item>
$trendingKeyword = (string) $topItem->title;
$trafficVolume = (string) $topItem->children('https://trends.google.com/trending/rss')->approx_traffic;
// The Google Trends RSS Description contains real-time news snippets related to the keyword.
// We strip HTML tags (like <a> and <img>) to just get the raw, 100% unique news text.
$rawNewsDescription = (string) $topItem->description;
$cleanNewsSnippet = trim(strip_tags($rawNewsDescription));

if (empty($trendingKeyword)) {
    http_response_code(404);
    echo json_encode(['error' => 'No trending keyword found']);
    exit;
}

// ── 2. Check for Duplicates (High-Performance MySQL) ──
// Remove English special characters but keep Japanese/Asian characters intact
$slugText = preg_replace('/[^\p{L}\p{N}]+/u', '-', $trendingKeyword);
$slug = "viral-" . strtolower($slugText);
$slug = trim($slug, '-');
// Append country logic to slug
$fullSlug = strtolower($geoValid) . '/' . $targetLang . '-' . $slug;

// Query the MySQL Database instantly instead of loading JSON into memory
$stmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug = :slug");
$stmt->execute(['slug' => $fullSlug]);
$isDuplicate = $stmt->fetchColumn() > 0;

if ($isDuplicate) {
    http_response_code(200);
    echo json_encode(['status' => 'skipped', 'message' => 'Article already generated today for: ' . $trendingKeyword . ' (' . $geoValid . ')']);
    unset($xml); // Free XML memory
    gc_collect_cycles(); // Force Garbage Collection
    exit;
}

// Free simpleXML object aggressively from memory.
unset($xml);
gc_collect_cycles();

// ── 3. Execute Python SEO Generator Engine ─────────────────────────────────────
$currentDate = date("d F Y");

$pythonScript = __DIR__ . '/generate_article.py';
$cmd = escapeshellcmd("python3") . " " . escapeshellarg($pythonScript) . " " . escapeshellarg($trendingKeyword) . " " . escapeshellarg($trafficVolume) . " " . escapeshellarg($geoValid);

$descriptorspec = [
    0 => ["pipe", "r"], // stdin
    1 => ["pipe", "w"], // stdout
    2 => ["pipe", "w"]  // stderr
];

$process = proc_open($cmd, $descriptorspec, $pipes);
$pythonOutput = '';

if (is_resource($process)) {
    fclose($pipes[0]);
    $pythonOutput = stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    $pythonError = stream_get_contents($pipes[2]);
    fclose($pipes[2]);
    $return_value = proc_close($process);

    if ($return_value !== 0) {
        http_response_code(500);
        echo json_encode(['error' => 'Python Generator failed', 'details' => $pythonError]);
        exit;
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to initialize Python generator process']);
    exit;
}

$generatedData = json_decode($pythonOutput, true);
if (!$generatedData || !isset($generatedData['status']) || $generatedData['status'] !== 'success') {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to parse JSON from Python generator']);
    exit;
}

// Inject the real-time news snippet dynamically. This guarantees every article 
// is 100% unique to Google Crawlers because it contains that exact day's news context!
$newsBlock = !empty($cleanNewsSnippet) ? "\n\n> 📰 **Latest News Snippet:** *$cleanNewsSnippet*" : "";
$markdownContent = $newsBlock . "\n\n" . $generatedData['content'];

// ── 4. Inject Payload via Database Protocol (High-Performance MySQL) ──
$faqs = $generatedData['faqs'];

$sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content) 
        VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :images, :faqs, :content)";

// Generate a random high-quality structural image as a placeholder for the trend
$placeholderImages = [
    [
        "url" => "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        "alt" => "$trendingKeyword Analysis",
        "is_primary" => true
    ]
];

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([
    'slug' => $fullSlug,
    'title' => $generatedData['title'],
    'description' => $generatedData['description'],
    'service' => 'Data Analyst',
    'serviceLabel' => strtoupper($geoValid) . ' Market Trend',
    'accent' => '#f59e0b',
    'accentLight' => '#fef3c7',
    'images' => json_encode($placeholderImages),
    'faqs' => json_encode($faqs),
    'content' => $markdownContent
]);

if ($success) {
    // ── 5. Automate Sitemap Injection ──────────────────────────────────────────
    $sitemapFile = __DIR__ . '/../../public/sitemap.xml';
    if (file_exists($sitemapFile)) {
        // We use DOMDocument since it handles formatting better than SimpleXML
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;

        if ($dom->load($sitemapFile)) {
            $urlset = $dom->getElementsByTagName('urlset')->item(0);

            if ($urlset) {
                // Ensure xhtml namespace exists on root for hreflang
                if (!$urlset->hasAttribute('xmlns:xhtml')) {
                    $urlset->setAttribute('xmlns:xhtml', 'http://www.w3.org/1999/xhtml');
                }

                $newUrlNode = $dom->createElement('url');

                $locNode = $dom->createElement('loc', 'https://nurdiansyahlabs.com/blog/' . $fullSlug);
                $lastmodNode = $dom->createElement('lastmod', date('Y-m-d'));
                $changefreqNode = $dom->createElement('changefreq', 'weekly');
                $priorityNode = $dom->createElement('priority', '0.9');

                $newUrlNode->appendChild($locNode);
                $newUrlNode->appendChild($lastmodNode);
                $newUrlNode->appendChild($changefreqNode);
                $newUrlNode->appendChild($priorityNode);

                // Add explicit Hreflang reference for strict Search Console validation
                if (!empty($targetLang)) {
                    $xhtmlLink = $dom->createElementNS('http://www.w3.org/1999/xhtml', 'xhtml:link');
                    $xhtmlLink->setAttribute('rel', 'alternate');
                    $xhtmlLink->setAttribute('hreflang', $targetLang);
                    $xhtmlLink->setAttribute('href', 'https://nurdiansyahlabs.com/blog/' . $fullSlug);
                    $newUrlNode->appendChild($xhtmlLink);
                }

                $urlset->appendChild($newUrlNode);

                $dom->save($sitemapFile);
            }
        }
    }

    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'keyword_found' => $trendingKeyword,
        'volume' => $trafficVolume,
        'slug_generated' => $slug
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to serialize JSON to MySQL Database']);
}
exit;
