<?php
/**
 * NurdiansyahLabs – Contact Form & Lead Generation API
 * Deployed at: /public_html/api/contact.php
 * 
 * Accepts POST requests containing contact form submissions.
 * Stores data directly into the leads MySQL table and sends an email notification.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

define('ADMIN_EMAIL', 'Nudiansyahdian28.adv@gmail.com');

// ── Read JSON payload ────────────────────────────────────────────────────────
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

// ── Validate inputs ──────────────────────────────────────────────────────────
$name = trim($input['name'] ?? '');
$contact = trim($input['contact'] ?? '');
$service = trim($input['service'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($contact) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, Contact (Email/Phone), and Message are required']);
    exit;
}

// ── Insert Lead to MySQL ─────────────────────────────────────────────────────
$timestamp = date('Y-m-d H:i:s');
$leadId = null;

if ($pdo) {
    $sql = "INSERT INTO leads (name, contact, service, message, timestamp) 
            VALUES (:name, :contact, :service, :message, :timestamp)";
    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        'name' => $name,
        'contact' => $contact,
        'service' => $service,
        'message' => $message,
        'timestamp' => $timestamp
    ]);

    if (!$success) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save lead to database']);
        exit;
    }

    $leadId = $pdo->lastInsertId();
}

$ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

// ── Send Email Notification (Via Gmail SMTP) ─────────────────────────

// Require the Composer autoloader
require 'vendor/autoload.php';

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';             // Gmail SMTP server
    $mail->SMTPAuth   = true;                         // Enable SMTP authentication
    
    // YOUR GMAIL CREDENTIALS HERE:
    $mail->Username   = 'Nudiansyahdian28.adv@gmail.com';
    $mail->Password   = 'qevs ydnh vxkg ixof'; 
    
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; 
    $mail->Port       = 587;                            // TCP port to connect to

    // Recipients
    $mail->setFrom('Nudiansyahdian28.adv@gmail.com', 'NurdiansyahLabs Website');
    $mail->addAddress(ADMIN_EMAIL);                   // Sends to the ADMIN_EMAIL you defined at the top
    $mail->addReplyTo($contact, $name);               // Replies go directly to the person who filled the form

    // Content
    $mail->isHTML(false);                             // Set email format to plain text
    $mail->Subject = "⭐ New Lead from $name (" . ($service ?: 'General Inquiry') . ")";
    
    $body = "New contact form submission:\n\n";
    $body .= "Name: $name\n";
    $body .= "Contact: $contact\n";
    $body .= "Service Interest: " . ($service ?: 'None specified') . "\n";
    $body .= "IP: $ip\n\n";
    $body .= "Message:\n$message\n";
    
    $mail->Body = $body;

    $mail->send();
    
    // ── Success Response ─────────────────────────────────────────────────────────
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Your message has been sent successfully.',
        'lead_id' => $leadId
    ]);
    
} catch (Exception $e) {
    // If saving to DB worked, but email failed
    http_response_code(201);
    echo json_encode([
        'status' => 'partial_success',
        'message' => 'Message saved, but email notification failed.',
    ]);
}

