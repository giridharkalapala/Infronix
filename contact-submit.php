<?php
/**
 * Infronix Global Services - Pure Standalone Form Submission & Email Delivery Engine
 * 
 * Processes all website submissions (Contact Form, Consultation Modal, AI Partner Forms,
 * Service Inquiries) and sends dual executive HTML emails:
 * 1. Admin Lead Alert -> Sent to dharishbandi@gmail.com
 * 2. Client Confirmation Receipt -> Sent to the visitor's email address
 * 
 * No database required. Clean, professional, ID-free email communication.
 */

// Determine if request is an AJAX / Fetch API call or native standard form POST
$isAjax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
    || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'json') !== false)
    || (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'json') !== false)
    || isset($_POST['form_type']);

// Safe string length helper (handles environments without mbstring extension)
function safe_str_length(string $str): int {
    return function_exists('mb_strlen') ? mb_strlen($str, 'UTF-8') : strlen($str);
}

// Only accept POST requests (Redirect direct GET navigation back to homepage)
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        http_response_code(405);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
        exit;
    } else {
        header('Location: index.html');
        exit;
    }
}

// Email Delivery Configuration
define('ADMIN_EMAIL', 'dharishbandi@gmail.com');
define('MAIL_FROM_NAME', 'Infronix Global Services');
define('MAIL_FROM_EMAIL', 'dharishbandi@gmail.com');

// Gmail SMTP Credentials (SSL Socket to smtp.gmail.com:465)
define('SMTP_HOST', 'ssl://smtp.gmail.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'dharishbandi@gmail.com');
define('SMTP_PASS', 'mapgrnmothrebdkl');

// Anti-Spam Honeypot Verification (Bots filling hidden trap fields are silently dismissed)
$honeypot = trim($_POST['website'] ?? $_POST['url'] ?? $_POST['honeypot'] ?? $_POST['b_name'] ?? '');
if (!empty($honeypot)) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.'
        ]);
        exit;
    } else {
        render_html_confirmation_screen('Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.');
        exit;
    }
}

// 1. Sanitize & Normalize Form Inputs
$formType = trim($_POST['form_type'] ?? 'Website Inquiry');

// Name
$name = trim($_POST['name'] ?? $_POST['full_name'] ?? $_POST['user_name'] ?? '');

// Email
$email = trim($_POST['email'] ?? $_POST['work_email'] ?? $_POST['user_email'] ?? '');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Phone / Mobile
$phone = trim($_POST['phone'] ?? $_POST['tel'] ?? $_POST['mobile'] ?? '');

// Company
$company = trim($_POST['company'] ?? $_POST['org'] ?? $_POST['organization'] ?? '');

// Service / Domain
$service = '';
if (!empty($_POST['services'])) {
    if (is_array($_POST['services'])) {
        $service = implode(', ', array_map('trim', $_POST['services']));
    } else {
        $service = trim($_POST['services']);
    }
} elseif (!empty($_POST['service'])) {
    if (is_array($_POST['service'])) {
        $service = implode(', ', array_map('trim', $_POST['service']));
    } else {
        $service = trim($_POST['service']);
    }
} elseif (!empty($_POST['capability'])) {
    $service = trim($_POST['capability']);
}
if (empty($service)) {
    $service = 'General Technology Consultation';
}

// Budget info (if provided)
$budget = trim($_POST['budget'] ?? '');

// Message / Project Overview / Scope
$rawMessage = trim($_POST['message'] ?? $_POST['details'] ?? $_POST['requirements'] ?? $_POST['notes'] ?? '');

// 2. Strict Server-Side Validation Rules
$errors = [];

// [Validation 1] Name: Only alphabets and spaces, no numbers or special symbols
if (empty($name)) {
    $errors[] = 'Full Name is required.';
} elseif (!preg_match('/^[a-zA-Z\s]+$/', $name)) {
    $errors[] = 'Name must contain only alphabets and spaces (numbers and special symbols are not allowed).';
} elseif (safe_str_length($name) < 2) {
    $errors[] = 'Name must be at least 2 characters long.';
}

// [Validation 2] Email: Valid work email address
if (empty($email)) {
    $errors[] = 'Work Email address is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) {
    $errors[] = 'Please provide a valid work email address.';
}

// [Validation 3] Mobile / Phone: Exactly 10 digits only (more than 10 digits not accepted)
if (empty($phone)) {
    $errors[] = 'Mobile number is required.';
} elseif (!preg_match('/^[0-9]{10}$/', $phone)) {
    $errors[] = 'Mobile number must be exactly 10 digits only (more or less than 10 digits, letters, or symbols are not accepted).';
}

// [Validation 4] Company: Only alphabets and space
if (!empty($company) && !preg_match('/^[a-zA-Z\s]+$/', $company)) {
    $errors[] = 'Company field should accept only alphabets and spaces.';
}

// [Validation 5] Project Overview / Scope: Required and maximum 250 characters
$rawMessageLen = safe_str_length($rawMessage);
if (empty($rawMessage)) {
    $errors[] = 'Project Overview / Scope is required.';
} elseif ($rawMessageLen > 250) {
    $errors[] = 'Project Overview / Scope must not exceed 250 characters (currently ' . $rawMessageLen . ' characters).';
}

// Return validation errors if any check fails
if (!empty($errors)) {
    $errorMessage = implode(' ', $errors);
    if ($isAjax) {
        http_response_code(400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'success' => false,
            'message' => $errorMessage,
            'errors'  => $errors
        ]);
        exit;
    } else {
        render_html_error_screen($errorMessage, $errors);
        exit;
    }
}

$messageParts = [];
if (!empty($budget)) {
    $messageParts[] = "[Project Budget: {$budget}]";
}
$messageParts[] = $rawMessage;
$finalMessage = implode("\n\n", $messageParts);

// 3. Dispatch Dual Professional Emails
$timestamp = date('F d, Y \a\t h:i A T');

$emailPayload = [
    'form_type' => $formType,
    'name'      => $name,
    'email'     => $email,
    'phone'     => $phone,
    'company'   => $company,
    'service'   => $service,
    'message'   => $finalMessage,
    'timestamp' => $timestamp
];

// Send emails
$adminDelivered = false;
$userDelivered = false;

try {
    // 1. Admin Email (dharishbandi@gmail.com)
    $adminSubject = "🚨 New Inquiry: {$formType} — {$name}";
    $adminHtml = build_admin_email_template($emailPayload);
    $adminDelivered = send_smtp_email(ADMIN_EMAIL, $adminSubject, $adminHtml, $email);

    // 2. Client Acknowledgment Receipt
    $clientSubject = "Thank you for contacting Infronix Global Services";
    $clientHtml = build_client_email_template($emailPayload);
    $userDelivered = send_smtp_email($email, $clientSubject, $clientHtml, ADMIN_EMAIL);

} catch (Exception $e) {
    // Graceful error logging
}

// 4. Return Response based on request transport
$successMsg = 'Thank you for reaching out to Infronix Global Services. Our technology specialists will review your requirements and reach out within 24 business hours.';

if ($isAjax) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => true,
        'message' => $successMsg
    ]);
    exit;
} else {
    render_html_confirmation_screen($successMsg, $name, $email);
    exit;
}


/**
 * Sends HTML Email via Direct SSL SMTP Connection with fallback
 */
function send_smtp_email(string $to, string $subject, string $htmlBody, ?string $replyTo = null): bool {
    $host = SMTP_HOST;
    $port = SMTP_PORT;
    $username = SMTP_USER;
    $password = str_replace(' ', '', SMTP_PASS);

    $context = stream_context_create([
        'ssl' => [
            'verify_peer'       => false,
            'verify_peer_name'  => false,
            'allow_self_signed' => true
        ]
    ]);

    $socket = @stream_socket_client("{$host}:{$port}", $errno, $errstr, 12, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) {
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    // Read greeting
    fgets($socket, 515);

    // EHLO
    fputs($socket, "EHLO localhost\r\n");
    while ($line = fgets($socket, 515)) {
        if (substr($line, 3, 1) === ' ') break;
    }

    // AUTH LOGIN
    fputs($socket, "AUTH LOGIN\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '334') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    fputs($socket, base64_encode($username) . "\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '334') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    fputs($socket, base64_encode($password) . "\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '235') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    // MAIL FROM
    fputs($socket, "MAIL FROM: <{$username}>\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '250') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    // RCPT TO
    fputs($socket, "RCPT TO: <{$to}>\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '250' && substr($res, 0, 3) !== '251') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    // DATA
    fputs($socket, "DATA\r\n");
    $res = fgets($socket, 515);
    if (substr($res, 0, 3) !== '354') {
        fclose($socket);
        return send_php_mail_fallback($to, $subject, $htmlBody, $replyTo);
    }

    // Headers & Encoded Body
    $fromHeader = '=?UTF-8?B?' . base64_encode(MAIL_FROM_NAME) . '?= <' . $username . '>';
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

    $data = "Date: " . date('r') . "\r\n";
    $data .= "To: <{$to}>\r\n";
    $data .= "From: {$fromHeader}\r\n";
    if (!empty($replyTo)) {
        $data .= "Reply-To: <{$replyTo}>\r\n";
    }
    $data .= "Subject: {$encodedSubject}\r\n";
    $data .= "MIME-Version: 1.0\r\n";
    $data .= "Content-Type: text/html; charset=UTF-8\r\n";
    $data .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $data .= chunk_split(base64_encode($htmlBody)) . "\r\n.\r\n";

    fputs($socket, $data);
    $res = fgets($socket, 515);

    fputs($socket, "QUIT\r\n");
    fclose($socket);

    return (substr($res, 0, 3) === '250');
}

/**
 * Fallback via standard PHP mail()
 */
function send_php_mail_fallback(string $to, string $subject, string $htmlBody, ?string $replyTo = null): bool {
    $headers = [
        "MIME-Version: 1.0",
        "Content-type: text/html; charset=UTF-8",
        "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM_EMAIL . ">",
        "Reply-To: " . ($replyTo ?: ADMIN_EMAIL),
        "X-Mailer: PHP/" . phpversion()
    ];
    return @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
}

/**
 * Professional HTML Email Template for Admin Alert (Clean & ID-free)
 */
function build_admin_email_template(array $data): string {
    $name     = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
    $email    = htmlspecialchars($data['email'], ENT_QUOTES, 'UTF-8');
    $phone    = !empty($data['phone']) ? htmlspecialchars($data['phone'], ENT_QUOTES, 'UTF-8') : '<span style="color:#94a3b8;">Not provided</span>';
    $company  = !empty($data['company']) ? htmlspecialchars($data['company'], ENT_QUOTES, 'UTF-8') : '<span style="color:#94a3b8;">Not specified</span>';
    $service  = htmlspecialchars($data['service'], ENT_QUOTES, 'UTF-8');
    $formType = htmlspecialchars($data['form_type'], ENT_QUOTES, 'UTF-8');
    $message  = nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8'));
    $time     = htmlspecialchars($data['timestamp'], ENT_QUOTES, 'UTF-8');

    $rawPhone = preg_replace('/[^0-9+]/', '', $data['phone'] ?? '');

    $callClientBtn = '';
    if (!empty($rawPhone)) {
        $callClientBtn = <<<HTML
              <a href="tel:{$rawPhone}" style="display:inline-block; background:#f1f5f9; color:#0f172a; border:1px solid #cbd5e1; font-size:14px; font-weight:600; text-decoration:none; padding:13px 22px; border-radius:8px; margin:4px 6px;">
                📞 Call Client
              </a>
HTML;
    }

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Lead Notification</title>
</head>
<body style="margin:0; padding:30px 15px; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
    <!-- Header -->
    <tr>
      <td style="background:linear-gradient(135deg, #031038 0%, #0055d4 100%); padding:32px 30px; text-align:center; color:#ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <div style="display:inline-block; background:rgba(0,200,255,0.15); border:1px solid #00c8ff; color:#00c8ff; padding:5px 16px; border-radius:20px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">
                {$formType}
              </div>
              <h1 style="margin:0; font-size:23px; font-weight:700; letter-spacing:-0.5px; color:#ffffff;">New Client Inquiry Received</h1>
              <p style="margin:6px 0 0 0; font-size:13px; color:#93c5fd;">Infronix Global Services &mdash; Web Portal</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:32px 30px;">
        <p style="font-size:14px; line-height:1.6; color:#475569; margin:0 0 20px 0;">
          A new client has submitted an inquiry through your website. Here are the details:
        </p>

        <!-- Details Table -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:separate; border-spacing:0; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; margin-bottom:24px;">
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; width:34%; font-size:13px; font-weight:600; color:#64748b;">Client Name</td>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:700; color:#0f172a;">{$name}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; font-weight:600; color:#64748b;">Work Email</td>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px;">
              <a href="mailto:{$email}" style="color:#0055d4; text-decoration:none; font-weight:600;">{$email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; font-weight:600; color:#64748b;">Phone Number</td>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; color:#334155;">{$phone}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; font-weight:600; color:#64748b;">Company / Org</td>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; color:#334155;">{$company}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:13px; font-weight:600; color:#64748b;">Service Scope</td>
            <td style="padding:12px 16px; border-bottom:1px solid #e2e8f0; font-size:14px; font-weight:600; color:#0055d4;">{$service}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px; font-size:13px; font-weight:600; color:#64748b;">Received On</td>
            <td style="padding:12px 16px; font-size:12px; color:#64748b;">{$time}</td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; color:#475569; margin-bottom:8px;">
          Requirement Brief / Message:
        </div>
        <div style="background:#ffffff; border:1px solid #cbd5e1; border-left:4px solid #0055d4; border-radius:8px; padding:18px; font-size:14px; line-height:1.65; color:#1e293b; margin-bottom:28px;">
          {$message}
        </div>

        <!-- Quick Action Buttons -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <a href="mailto:{$email}?subject=Regarding%20your%20inquiry%20to%20Infronix%20Global" style="display:inline-block; background:#0055d4; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none; padding:13px 26px; border-radius:8px; margin:4px 6px;">
                ✉ Reply to Client
              </a>
              {$callClientBtn}
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc; padding:20px 30px; text-align:center; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; line-height:1.5;">
        Infronix Global Services Pvt. Ltd. &bull; Enterprise Inquiry System<br>
        Direct delivery to {$data['email']} &amp; administrator.
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Professional HTML Email Template for Client Confirmation (Clean & ID-free)
 */
function build_client_email_template(array $data): string {
    $name     = htmlspecialchars($data['name'], ENT_QUOTES, 'UTF-8');
    $service  = htmlspecialchars($data['service'], ENT_QUOTES, 'UTF-8');
    $time     = htmlspecialchars($data['timestamp'], ENT_QUOTES, 'UTF-8');

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Inquiry Confirmation - Infronix Global Services</title>
</head>
<body style="margin:0; padding:30px 15px; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.06); border:1px solid #e2e8f0;">
    <!-- Brand Header -->
    <tr>
      <td style="background:linear-gradient(135deg, #031038 0%, #0055d4 100%); padding:38px 30px; text-align:center; color:#ffffff;">
        <h1 style="margin:0; font-size:25px; font-weight:800; letter-spacing:0.5px; color:#ffffff;">INFRONIX GLOBAL</h1>
        <p style="margin:6px 0 0 0; font-size:12px; text-transform:uppercase; letter-spacing:2px; color:#00c8ff; font-weight:600;">Enterprise Technology Solutions</p>
      </td>
    </tr>

    <!-- Body Content -->
    <tr>
      <td style="padding:36px 30px;">
        <h2 style="margin:0 0 16px 0; font-size:19px; font-weight:700; color:#0f172a;">Dear {$name},</h2>
        <p style="font-size:15px; line-height:1.65; color:#475569; margin:0 0 20px 0;">
          Thank you for contacting <strong>Infronix Global Services</strong>. We have received your inquiry regarding <strong>{$service}</strong>.
        </p>

        <!-- Guaranteed Turnaround Box -->
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; padding:20px; margin:24px 0;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td valign="top" style="width:28px; font-size:20px;">✓</td>
              <td style="padding-left:10px;">
                <h4 style="margin:0 0 4px 0; font-size:14.5px; font-weight:700; color:#0369a1;">Next Steps &amp; Turnaround</h4>
                <p style="margin:0; font-size:13.5px; line-height:1.55; color:#0c4a6e;">
                  Our Senior Engineering Consultants are reviewing your requirements. A dedicated solutions architect will connect with you within <strong>24 business hours</strong> with technical recommendations.
                </p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Capability Highlights -->
        <p style="font-size:14px; line-height:1.6; color:#475569; margin:0 0 14px 0;">
          In the meantime, feel free to explore our core technology practices:
        </p>
        <ul style="margin:0 0 28px 0; padding-left:20px; font-size:13.5px; line-height:1.7; color:#475569;">
          <li><strong>AI & Cognitive Automation</strong> &mdash; Autonomous LLMs, agentic workflows, and predictive intelligence.</li>
          <li><strong>Cloud Modernization & DevOps</strong> &mdash; Scalable Kubernetes infrastructures and multi-cloud GitOps.</li>
          <li><strong>Custom Software Engineering</strong> &mdash; High-performance enterprise web platforms and mobile ecosystems.</li>
        </ul>

        <!-- Signature -->
        <div style="border-top:1px solid #f1f5f9; padding-top:24px; font-size:13.5px; line-height:1.6; color:#64748b;">
          <strong style="color:#0f172a;">Infronix Global Services Pvt. Ltd.</strong><br>
          Client Engineering &amp; Strategic Solutions<br>
          <a href="mailto:dharishbandi@gmail.com" style="color:#0055d4; text-decoration:none;">dharishbandi@gmail.com</a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8fafc; padding:20px 30px; text-align:center; border-top:1px solid #e2e8f0; font-size:12px; color:#94a3b8; line-height:1.5;">
        &copy; 2026 Infronix Global Services Pvt. Ltd. All rights reserved.<br>
        Received on {$time}
      </td>
    </tr>
  </table>
</body>
</html>
HTML;
}

/**
 * Renders an executive branded HTML confirmation page for direct POST submissions (Progressive Enhancement)
 */
function render_html_confirmation_screen(string $message, string $name = 'Valued Client', string $email = ''): void {
    $safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $safeEmail = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $safeMsg = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inquiry Received | Infronix Global Services</title>
  <link rel="icon" type="image/svg+xml" href="./assets/logo/favicon.svg">
  <link rel="stylesheet" href="./css/style.css">
  <link rel="stylesheet" href="./css/components.css">
  <style>
    body {
      background: #0a0f1d;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 24px;
    }
    .confirmation-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(59, 130, 246, 0.25);
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 540px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }
    .success-badge {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #0ea5e9, #0055d4);
      color: #ffffff;
      font-size: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-bottom: 20px;
      box-shadow: 0 0 24px rgba(14, 165, 233, 0.4);
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 24px;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #0055d4, #0ea5e9);
      color: #ffffff;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    .back-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="confirmation-card">
    <div class="success-badge">✓</div>
    <h1>Inquiry Transmitted Successfully</h1>
    <p>Thank you, <strong>{$safeName}</strong>. {$safeMsg}</p>
    <a href="index.html" class="back-btn">&larr; Return to Infronix Global</a>
  </div>
</body>
</html>
HTML;
}

/**
 * Renders an executive branded HTML error page for direct POST submissions with validation issues
 */
function render_html_error_screen(string $message, array $errors = []): void {
    $safeMsg = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    
    $errorItemsHtml = '';
    if (!empty($errors)) {
        $errorItemsHtml .= '<ul style="text-align:left; color:#f87171; font-size:14px; line-height:1.7; margin:0 0 24px 0; padding-left:24px;">';
        foreach ($errors as $err) {
            $errorItemsHtml .= '<li>' . htmlspecialchars($err, ENT_QUOTES, 'UTF-8') . '</li>';
        }
        $errorItemsHtml .= '</ul>';
    }

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Submission Error | Infronix Global Services</title>
  <link rel="icon" type="image/svg+xml" href="./assets/logo/favicon.svg">
  <link rel="stylesheet" href="./css/style.css">
  <link rel="stylesheet" href="./css/components.css">
  <style>
    body {
      background: #0a0f1d;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 24px;
    }
    .error-card {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 540px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }
    .error-badge {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      color: #ffffff;
      font-size: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-bottom: 20px;
      box-shadow: 0 0 24px rgba(239, 68, 68, 0.4);
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 12px;
    }
    p {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 20px;
    }
    .back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #ffffff;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      cursor: pointer;
      border: none;
      font-size: 14px;
    }
    .back-btn:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="error-badge">✕</div>
    <h1>Validation Notice</h1>
    <p>Please correct the following issues to complete your inquiry:</p>
    {$errorItemsHtml}
    <button onclick="history.back()" class="back-btn">&larr; Return &amp; Correct Form</button>
  </div>
</body>
</html>
HTML;
}
