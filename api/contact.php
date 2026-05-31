<?php
/**
 * NurdiansyahLabs – Contact Form & Lead Generation API
 * Deployed at: /public_html/api/contact.php
 * 
 * Accepts POST requests containing contact form submissions.
 * Stores data directly into the leads MySQL table and sends an email notification.
 */

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');

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

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

define('ADMIN_EMAIL', 'Nudiansyahdian28.adv@gmail.com');

// ── Read JSON payload ────────────────────────────────────────────────────────
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

// ── Validate & sanitise inputs ───────────────────────────────────────────────
$name = substr(strip_tags(trim($input['name'] ?? '')), 0, 120);
$contact = substr(strip_tags(trim($input['contact'] ?? '')), 0, 120);
$service = substr(strip_tags(trim($input['service'] ?? '')), 0, 100);
$message = substr(strip_tags(trim($input['message'] ?? '')), 0, 2000);

if (empty($name) || empty($contact) || empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, Contact (Email/Phone), and Message are required']);
    exit;
}

// Validate contact is a valid email or phone-like string
if (!filter_var($contact, FILTER_VALIDATE_EMAIL) && !preg_match('/^[0-9\+\-\s]{6,20}$/', $contact)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please provide a valid email address or phone number.']);
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

// Composer autoloader is loaded at top of file

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    
    // Baca konfigurasi SMTP dari env.local.php (jika ada) atau fallback
    $smtpHost = defined('SMTP_HOST') ? SMTP_HOST : (getenv('SMTP_HOST') ?: 'mail.nurdiansyahlabs.com');
    $smtpUser = defined('SMTP_USER') ? SMTP_USER : (getenv('SMTP_USER') ?: 'admin@nurdiansyahlabs.com');
    $smtpPass = defined('SMTP_PASS') ? SMTP_PASS : (getenv('SMTP_PASS') ?: '');
    $smtpPort = defined('SMTP_PORT') ? SMTP_PORT : (getenv('SMTP_PORT') ?: 465); // 465 for SSL, 587 for TLS
    
    $mail->Host = $smtpHost;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->SMTPSecure = ($smtpPort == 465) ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtpPort;

    // Recipients
    $mail->setFrom($smtpUser, 'NurdiansyahLabs System');
    $mail->addAddress(ADMIN_EMAIL);
    if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($contact, $name);
    }

    // Content
    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = "🚀 New Lead: $name (" . ($service ?: 'General Inquiry') . ")";

    // HTML Email Template
    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>
        <div style='background-color: #0f172a; padding: 24px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;'>New Lead Notification</h2>
            <p style='color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;'>NurdiansyahLabs Web Platform</p>
        </div>
        <div style='padding: 32px; background-color: #ffffff;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 35%;'><strong>Full Name</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: bold;'>{$name}</td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;'><strong>Contact Info</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-size: 15px; font-weight: bold;'>
                        <a href='mailto:{$contact}' style='color: #0284c7; text-decoration: none;'>{$contact}</a>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;'><strong>Service Interest</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px;'>
                        <span style='background-color: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 13px; font-weight: bold;'>
                            " . ($service ?: 'General Inquiry') . "
                        </span>
                    </td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;'><strong>IP Address</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;'>{$ip}</td>
                </tr>
            </table>
            <div style='margin-top: 24px; padding: 16px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 4px;'>
                <p style='margin: 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;'>Message</p>
                <p style='margin: 8px 0 0 0; color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap;'>{$message}</p>
            </div>
        </div>
        <div style='background-color: #f1f5f9; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px;'>
            <p style='margin: 0;'>This email was automatically generated by NurdiansyahLabs CRM System.</p>
        </div>
    </div>
    ";

    $mail->AltBody = "New Lead: {$name} | Contact: {$contact} | Service: {$service} | Message: {$message}";

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

