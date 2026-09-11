<?php
ob_start();
error_reporting(0);
ini_set("display_errors", "0");

require_once __DIR__ . "/mailer/Exception.php";
require_once __DIR__ . "/mailer/PHPMailer.php";
require_once __DIR__ . "/mailer/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Config

$to_email = "hello@claydesigns.cc";
$to_name = "Clay";
$recaptcha_secret = "6LfX2RctAAAAAOsY0PdjI7fNx68qvBwKw0l2yTo5";
$smtp_password = 'Nuclei$Salvation$Pluck$Tipped$Railcar5';

$allowed_origins = [
    "http://localhost",
    "http://127.0.0.1",
    "https://claydesigns.cc",
    "https://www.claydesigns.cc",
];

// Headers

header("Content-Type: application/json; charset=utf-8");

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";
if (in_array($origin, $allowed_origins, true)) {
    header("Access-Control-Allow-Origin: {$origin}");
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    ob_end_clean();
    http_response_code(405);
    exit(json_encode(["error" => "Method not allowed."]));
}

// Decode body

$body = json_decode(file_get_contents("php://input"), true);

if (!is_array($body)) {
    ob_end_clean();
    http_response_code(400);
    exit(json_encode(["error" => "Invalid request body."]));
}

// reCAPTCHA v3

$captcha_token = trim($body["g-recaptcha-response"] ?? "");

if (empty($captcha_token)) {
    ob_end_clean();
    http_response_code(400);
    exit(json_encode(["error" => "reCAPTCHA token missing."]));
}

if (function_exists("curl_init")) {
    $ch = curl_init("https://www.google.com/recaptcha/api/siteverify");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            "secret" => $recaptcha_secret,
            "response" => $captcha_token,
            "remoteip" => $_SERVER["REMOTE_ADDR"] ?? "",
        ]),
        CURLOPT_TIMEOUT => 5,
    ]);
    $captcha_result = json_decode(curl_exec($ch), true);
    $curl_error = curl_errno($ch);
    curl_close($ch);

    $verified =
        !$curl_error &&
        ($captcha_result["success"] ?? false) &&
        ($captcha_result["score"] ?? 0) >= 0.5 &&
        ($captcha_result["action"] ?? "") === "contact";

    $recaptcha_score = $captcha_result["score"] ?? "n/a";

    if (!$verified) {
        ob_end_clean();
        http_response_code(400);
        exit(
            json_encode([
                "error" => "reCAPTCHA verification failed. Please try again.",
            ])
        );
    }
}

// Validate

$name = strip_tags(trim($body["name"] ?? ""));
$subject = strip_tags(trim($body["subject"] ?? ""));
$message = strip_tags(trim($body["message"] ?? ""));
$email = filter_var(trim($body["email"] ?? ""), FILTER_SANITIZE_EMAIL);

if (
    mb_strlen($name) < 2 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    mb_strlen($subject) < 1 ||
    mb_strlen($message) < 20
) {
    ob_end_clean();
    http_response_code(422);
    exit(
        json_encode([
            "error" => "Please fill in all required fields correctly.",
        ])
    );
}

// Send

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = "smtp.hostinger.com";
    $mail->SMTPAuth = true;
    $mail->Username = "hello@claydesigns.cc";
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->CharSet = "UTF-8";

    $mail->setFrom("hello@claydesigns.cc", "Portfolio Contact Form");
    $mail->addAddress($to_email, $to_name);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = "Portfolio Contact: {$subject}";
    $mail->Body =
        "Name:    {$name}\nEmail:   {$email}\nSubject: {$subject}\n\nMessage:\n{$message}\n\n---\nIP: " .
        ($_SERVER["REMOTE_ADDR"] ?? "unknown") .
        "\nreCAPTCHA Score: " .
        ($recaptcha_score ?? "n/a") .
        " / 1.0";

    $mail->send();

    ob_end_clean();
    http_response_code(200);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    error_log("PHPMailer: " . $mail->ErrorInfo);
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        "error" =>
            "Could not send message. Please email hello@claydesigns.cc directly.",
    ]);
}
$to_name = "Clay";
