<?php
/**
 * Migration Script: Add images JSON column to posts table
 * Run this via CLI `php migrate_images_json.php` or temporarily from browser
 */

require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();
    if (!$pdo) {
        throw new PDOException("Database connection failed.");
    }

    echo "✅ Connected to Database.\n";

    // Add images column if it doesn't exist
    $pdo->exec("
        ALTER TABLE `posts`
        ADD COLUMN `images` JSON NULL AFTER `img`;
    ");

    echo "✅ Successfully added `images` JSON column to `posts` table.\n";

    // Migrate existing img strings to the new images JSON structure
    $stmt = $pdo->query("SELECT id, img FROM posts WHERE img IS NOT NULL AND img != ''");
    $posts = $stmt->fetchAll();

    $updateStmt = $pdo->prepare("UPDATE posts SET images = :images WHERE id = :id");

    $migrated = 0;
    foreach ($posts as $post) {
        $imagesArr = [
            [
                "url" => $post['img'],
                "alt" => "Post Image",
                "is_primary" => true
            ]
        ];
        $updateStmt->execute([
            'images' => json_encode($imagesArr),
            'id' => $post['id']
        ]);
        $migrated++;
    }

    echo "✅ Migrated $migrated existing posts to new JSON image format.\n";

} catch (PDOException $e) {
    // Column might already exist, which is fine
    if (strpos($e->getMessage(), 'Duplicate column name') !== false) {
        echo "✅ Column `images` already exists.\n";
    } else {
        die("\n❌ Migration Error: " . $e->getMessage() . "\n");
    }
}
?>