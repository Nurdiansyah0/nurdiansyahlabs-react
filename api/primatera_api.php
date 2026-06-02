<?php
// api/primatera_api.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../database/db.php';

try {
    $pdo = getDB();
    if (!$pdo) {
        throw new Exception("Database connection failed");
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $resource = isset($_GET['resource']) ? $_GET['resource'] : '';
    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'GET') {
        if ($resource === 'records') {
            $stmt = $pdo->query("SELECT * FROM primatera_records ORDER BY date DESC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } elseif ($resource === 'transactions') {
            $stmt = $pdo->query("SELECT * FROM primatera_transactions ORDER BY date DESC");
            echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
        } elseif ($resource === 'inventory') {
            $stmt = $pdo->query("SELECT * FROM primatera_inventory WHERE id = 1");
            $inv = $stmt->fetch(PDO::FETCH_ASSOC);
            if (!$inv) { $inv = ['feed' => 0, 'medicine' => 0]; }
            echo json_encode(['success' => true, 'data' => $inv]);
        } else {
            // Fetch everything on initial load
            $records = $pdo->query("SELECT * FROM primatera_records ORDER BY date DESC")->fetchAll(PDO::FETCH_ASSOC);
            $transactions = $pdo->query("SELECT * FROM primatera_transactions ORDER BY date DESC")->fetchAll(PDO::FETCH_ASSOC);
            $inv = $pdo->query("SELECT * FROM primatera_inventory WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
            if (!$inv) { $inv = ['feed' => 0, 'medicine' => 0]; }
            
            // Format numbers appropriately so React state isn't broken
            foreach ($records as &$r) {
                $r['feedConsumedKg'] = (float)$r['feedConsumedKg'];
                $r['medicineUsedPcs'] = (int)$r['medicineUsedPcs'];
                $r['mortalityCount'] = (int)$r['mortalityCount'];
                $r['bodyWeightGrams'] = (int)$r['bodyWeightGrams'];
                $r['date'] = (int)$r['date'];
            }
            foreach ($transactions as &$t) {
                $t['amount'] = (float)$t['amount'];
                $t['quantity'] = (float)$t['quantity'];
                $t['harvestCount'] = (int)$t['harvestCount'];
                $t['date'] = (int)$t['date'];
            }
            $inv['feed'] = (float)$inv['feed'];
            $inv['medicine'] = (int)$inv['medicine'];

            echo json_encode(['success' => true, 'records' => $records, 'transactions' => $transactions, 'inventory' => $inv]);
        }
    } elseif ($method === 'POST') {
        if ($resource === 'records') {
            $stmt = $pdo->prepare("INSERT INTO primatera_records (id, date, dateString, flockId, feedConsumedKg, medicineUsedPcs, mortalityCount, bodyWeightGrams, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$input['id'], $input['date'], $input['dateString'], $input['flockId'], $input['feedConsumedKg'], $input['medicineUsedPcs'], $input['mortalityCount'], $input['bodyWeightGrams'], $input['notes']]);
            echo json_encode(['success' => true]);
        } elseif ($resource === 'transactions') {
            $stmt = $pdo->prepare("INSERT INTO primatera_transactions (id, date, dateString, type, category, amount, quantity, harvestCount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$input['id'], $input['date'], $input['dateString'], $input['type'], $input['category'], $input['amount'], $input['quantity'], $input['harvestCount'] ?? 0, $input['notes']]);
            echo json_encode(['success' => true]);
        } elseif ($resource === 'inventory') {
            $stmt = $pdo->prepare("UPDATE primatera_inventory SET feed = ?, medicine = ? WHERE id = 1");
            $stmt->execute([$input['feed'], $input['medicine']]);
            echo json_encode(['success' => true]);
        }
    } elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? '';
        if ($resource === 'records') {
            $stmt = $pdo->prepare("DELETE FROM primatera_records WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } elseif ($resource === 'transactions') {
            $stmt = $pdo->prepare("DELETE FROM primatera_transactions WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
