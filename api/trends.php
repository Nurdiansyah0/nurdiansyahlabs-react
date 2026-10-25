<?php
/**
 * NurdiansyahLabs – Google Trends API Proxy (PHP)
 * Deployed at: /public_html/api/trends.php
 * 
 * Fetches Google Trends data via the public RSS feed (no API key required).
 * Results are cached in a file for 6 hours to avoid rate limiting.
 *
 * Usage:
 *   GET /api/trends.php               → top opportunities (all services)
 *   GET /api/trends.php?service=A     → trends for Landing Page keywords
 *   GET /api/trends.php?keyword=xxx   → single keyword interest
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// ── Cache settings ────────────────────────────────────────────────────────────
define('CACHE_DIR', __DIR__ . '/../cache/');
define('CACHE_TTL', 6 * 3600); // 6 hours

// ── Service keyword map ───────────────────────────────────────────────────────
$SERVICE_KEYWORDS = [
    'A' => ['label' => 'Landing Page', 'keywords' => [
        'jasa landing page', 'buat website bisnis', 'landing page murah', 'website UMKM',
    ]],
    'B' => ['label' => 'Fullstack Dev', 'keywords' => [
        'jasa fullstack developer', 'jasa aplikasi web custom', 'programmer freelance indonesia',
    ]],
    'C' => ['label' => 'Data Analyst', 'keywords' => [
        'jasa analisis data', 'buat dashboard bisnis', 'jasa power bi', 'laporan data penjualan',
    ]],
    'D' => ['label' => 'Data Scientist', 'keywords' => [
        'jasa machine learning', 'jasa data scientist', 'prediksi penjualan data',
    ]],
];

// ── Utility: read cache ────────────────────────────────────────────────────────
function readCache(string $key): ?array {
    $file = CACHE_DIR . md5($key) . '.json';
    if (!file_exists($file)) return null;
    if (time() - filemtime($file) > CACHE_TTL) return null;
    $data = json_decode(file_get_contents($file), true);
    return $data ?: null;
}

// ── Utility: write cache ───────────────────────────────────────────────────────
function writeCache(string $key, array $data): void {
    if (!is_dir(CACHE_DIR)) mkdir(CACHE_DIR, 0755, true);
    file_put_contents(CACHE_DIR . md5($key) . '.json', json_encode($data));
}

// ── Fetch Google Trends RSS for a keyword (Indonesia geo: ID) ─────────────
function fetchTrend(string $keyword): array {
    $cacheKey = 'trend_' . $keyword;
    $cached = readCache($cacheKey);
    if ($cached) return $cached;

    $encoded = urlencode($keyword);
    $url = "https://trends.google.com/trends/api/widgetdata/multiline?hl=id&tz=-420&req=%7B%22time%22%3A%222024-11-01+2025-02-21%22%2C%22resolution%22%3A%22WEEK%22%2C%22locale%22%3A%22id%22%2C%22comparisonItem%22%3A%5B%7B%22geo%22%3A%7B%22country%22%3A%22ID%22%7D%2C%22complexKeywordsRestriction%22%3A%7B%22keyword%22%3A%5B%7B%22type%22%3A%22BROAD%22%2C%22value%22%3A%22{$encoded}%22%7D%5D%7D%7D%5D%2C%22requestOptions%22%3A%7B%22property%22%3A%22%22%2C%22backend%22%3A%22IZG%22%2C%22category%22%3A0%7D%7D&token=null";

    // Try using Google Trends RSS fallback (public, no auth needed)
    $rssUrl = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=ID";
    $context = stream_context_create(['http' => [
        'timeout' => 8,
        'header' => "User-Agent: Mozilla/5.0 (compatible; NurdiansyahLabs/1.0)\r\n"
    ]]);

    // Use SerpAPI/DataForSEO-style fallback: parse interest from trending topics
    // For shared hosting, we use the Google Trends RSS feed for "trending now" topics
    // and match them against our service keywords
    $rssData = @file_get_contents($rssUrl, false, $context);

    $score = 0;
    $matchedTopics = [];

    if ($rssData !== false) {
        // Parse RSS XML
        libxml_use_internal_errors(true);
        $xml = @simplexml_load_string($rssData);
        if ($xml) {
            $keywordLower = mb_strtolower($keyword, 'UTF-8');
            $keywordParts = explode(' ', $keywordLower);

            foreach ($xml->channel->item as $item) {
                $title = mb_strtolower((string)$item->title, 'UTF-8');
                $traffic = (string)$item->children('ht', true)->approx_traffic ?? '0';
                $traffic = (int) preg_replace('/[^0-9]/', '', $traffic);

                // Score: how many keyword parts appear in the trending topic
                $matches = 0;
                foreach ($keywordParts as $part) {
                    if (strlen($part) > 3 && strpos($title, $part) !== false) {
                        $matches++;
                    }
                }

                if ($matches > 0) {
                    $matchedTopics[] = ['topic' => (string)$item->title, 'traffic' => $traffic];
                    $score += min(33, $matches * 16);
                }
            }
        }
    }

    // Additional: check keyword length/specificity as a proxy for search demand
    // Longer, more specific keywords = higher commercial intent
    $specificityBonus = min(20, strlen($keyword) / 2);
    $score = min(100, $score + $specificityBonus);

    $result = [
        'keyword' => $keyword,
        'score' => (int) $score,
        'matchedTopics' => array_slice($matchedTopics, 0, 3),
        'source' => 'Google Trends RSS + Specificity Scoring',
        'fetchedAt' => date('c'),
    ];

    writeCache($cacheKey, $result);
    return $result;
}

// ── Compute opportunity score ──────────────────────────────────────────────────
function computeOpportunities(array $serviceMap): array {
    $opportunities = [];

    foreach ($serviceMap as $serviceKey => $service) {
        foreach ($service['keywords'] as $kw) {
            $trend = fetchTrend($kw);
            $opportunities[] = [
                'keyword'    => $kw,
                'service'    => $serviceKey,
                'serviceLabel' => $service['label'],
                'score'      => $trend['score'],
                'matched'    => $trend['matchedTopics'],
                'source'     => $trend['source'],
                'slug'       => str_replace(' ', '-', strtolower($kw)),
                'blogUrl'    => '/blog/' . str_replace(' ', '-', strtolower($kw)),
            ];
        }
    }

    usort($opportunities, fn($a, $b) => $b['score'] <=> $a['score']);
    return $opportunities;
}

// ── Route: single keyword ─────────────────────────────────────────────────────
if (isset($_GET['keyword'])) {
    $kw = trim(strip_tags($_GET['keyword']));
    echo json_encode(fetchTrend($kw));
    exit;
}

// ── Route: single service ─────────────────────────────────────────────────────
if (isset($_GET['service'])) {
    $svc = strtoupper(trim($_GET['service']));
    if (!isset($SERVICE_KEYWORDS[$svc])) {
        http_response_code(404);
        echo json_encode(['error' => 'Service not found']);
        exit;
    }
    $filtered = [$svc => $SERVICE_KEYWORDS[$svc]];
    $opportunities = computeOpportunities($filtered);
    echo json_encode([
        'service'       => $svc,
        'label'         => $SERVICE_KEYWORDS[$svc]['label'],
        'opportunities' => $opportunities,
        'fetchedAt'     => date('c'),
    ]);
    exit;
}

// ── Route: all opportunities ──────────────────────────────────────────────────
$cacheKey = 'all_opportunities';
$cached = readCache($cacheKey);

if ($cached) {
    echo json_encode($cached);
    exit;
}

$all = computeOpportunities($SERVICE_KEYWORDS);

$response = [
    'status'        => 'ok',
    'fetchedAt'     => date('c'),
    'nextUpdate'    => date('c', time() + CACHE_TTL),
    'total'         => count($all),
    'opportunities' => $all,
    'top10'         => array_slice($all, 0, 10),
];

writeCache($cacheKey, $response);
echo json_encode($response);
