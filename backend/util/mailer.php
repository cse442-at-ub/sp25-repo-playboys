<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Composer dependency

function sendEmail($to, $subject, $message) {
    // $mail = new PHPMailer(true);
    // try {
    //     $mail->isSMTP();
    //     $mail->Host = 'smtp.example.com'; // Your SMTP server
    //     $mail->SMTPAuth = true;
    //     $mail->Username = 'your_email@example.com';
    //     $mail->Password = 'your_password';
    //     $mail->SMTPSecure = 'tls';
    //     $mail->Port = 587;

    //     $mail->setFrom('no-reply@example.com', 'Your App');
    //     $mail->addAddress($to);
    //     $mail->Subject = $subject;
    //     $mail->Body = $message;
    //     $mail->send();

    //     return true;
    // } catch (Exception $e) {
    //     return false;
    // }
}
?>
