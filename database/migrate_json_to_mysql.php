<?php
/**
 * NurdiansyahLabs – JSON to MySQL One-Time Migration Script
 * Upload this to your cPanel and run it ONCE to move all historical data.
 * 
 * Usage: Visit https://nurdiansyahlabs.com/backend-php/database/migrate_json_to_mysql.php in your browser
 */

header('Content-Type: text/plain');

require_once __DIR__ . '/db.php';
$pdo = getDB();

echo "Starting Data Migration from JSON to MySQL...\n\n";

// ── 1. Migrate Posts ─────────────────────────────────────────────────────────
$postsFile = __DIR__ . '/posts.json';
if (file_exists($postsFile)) {
    echo "Processing posts.json...\n";
    $posts = json_decode(file_get_contents($postsFile), true) ?? [];
    $insertedPosts = 0;

    $stmt = $pdo->prepare("INSERT IGNORE INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, img, faqs, content) 
                           VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :img, :faqs, :content)");

    foreach ($posts as $post) {
        if (!isset($post['slug']))
            continue;

        $success = $stmt->execute([
            'slug' => $post['slug'],
            'title' => $post['title'] ?? 'Untitled',
            'description' => $post['description'] ?? '',
            'service' => $post['service'] ?? 'A',
            'serviceLabel' => $post['serviceLabel'] ?? 'Service',
            'accent' => $post['accent'] ?? '#4f46e5',
            'accentLight' => $post['accentLight'] ?? '#eef2ff',
            'img' => $post['img'] ?? null,
            'faqs' => json_encode($post['faqs'] ?? []),
            'content' => $post['content'] ?? ''
        ]);

        if ($success && $stmt->rowCount() > 0) {
            $insertedPosts++;
        }
    }
    echo "✅ Successfully migrated $insertedPosts posts to MySQL.\n\n";
} else {
    echo "⚠️ posts.json not found. Skipping.\n\n";
}

// ── 2. Migrate Leads ─────────────────────────────────────────────────────────
$leadsFile = __DIR__ . '/leads.json';
if (file_exists($leadsFile)) {
    echo "Processing leads.json...\n";
    $leads = json_decode(file_get_contents($leadsFile), true) ?? [];
    $insertedLeads = 0;

    $stmt = $pdo->prepare("INSERT INTO leads (name, contact, service, message, timestamp) 
                           VALUES (:name, :contact, :service, :message, :timestamp)");

    foreach ($leads as $lead) {
        if (!isset($lead['name']))
            continue;

        // Attempt to parse standard date or fallback
        $ts = $lead['created_at'] ?? date('Y-m-d H:i:s');

        $success = $stmt->execute([

            'name' => $lead['name'],
            'contact' => $lead['contact'] ?? '',
            'service' => $lead['service'] ?? '',
            'message' => $lead['message'] ?? '',
            'timestamp' => $ts
        ]);

        if ($success) {
            $insertedLeads++;
        }
    }
    echo "✅ Successfully migrated $insertedLeads leads to MySQL.\n\n";
} else {
    echo "⚠️ leads.json not found. Skipping.\n\n";
}

// ── 3. Migrate Analytics ─────────────────────────────────────────────────────
$analyticsFile = __DIR__ . '/analytics.json';
if (file_exists($analyticsFile)) {
    echo "Processing analytics.json... (This may take a moment depending on the size)\n";

    // Read the file. If it's too large, this might hit memory limits, 
    // but for initial migration, it's usually fine.
    $jsonString = @file_get_contents($analyticsFile);
    $events = json_decode($jsonString, true) ?? [];
    $insertedEvents = 0;

    $stmt = $pdo->prepare("INSERT INTO analytics (type, path, visitorId, timestamp, title, service, duration, route, userAgent)
                           VALUES (:type, :path, :visitorId, :timestamp, :title, :service, :duration, :route, :userAgent)");

    // Process in chunks to prevent PDO overload on massive arrays
    $pdo->beginTransaction();
    try {
        foreach ($events as $e) {
            if (!isset($e['timestamp']) || !isset($e['type']))
                continue;

            // Format timestamp from ISO 8601 to MySQL DATETIME
            $ts = date('Y-m-d H:i:s', strtotime($e['timestamp']));

            $stmt->execute([
                'type' => $e['type'],
                'path' => $e['path'] ?? '/',
                'visitorId' => $e['visitorId'] ?? 'unknown',
                'timestamp' => $ts,
                'title' => $e['title'] ?? null,
                'service' => $e['service'] ?? null,
                'duration' => isset($e['duration']) ? (int) $e['duration'] : null,
                'route' => $e['slug'] ?? null, // Legacy slug mapped to route
                'userAgent' => $e['userAgent'] ?? 'Unknown'
            ]);
            $insertedEvents++;
        }
        $pdo->commit();
        echo "✅ Successfully migrated $insertedEvents analytics events to MySQL.\n\n";
    } catch (Exception $ex) {
        $pdo->rollBack();
        echo "❌ Error during analytics migration: " . $ex->getMessage() . "\n\n";
    }
} else {
    echo "⚠️ analytics.json not found. Skipping.\n\n";
}

echo "🎉 Database Migration Complete! You can now safely delete the .json files.\n";
