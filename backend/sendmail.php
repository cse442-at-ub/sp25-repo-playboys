<?php
// Include PHPMailer classes


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;



function sendEmail($email, $subject, $message){

    require __DIR__ . '/../PHPMailer/src/PHPMailer.php';
    require __DIR__ . '/../PHPMailer/src/SMTP.php';
    require __DIR__ . '/../PHPMailer/src/Exception.php';
    $config = include __DIR__ . '/config.php';

    // Create a new instance
    $mail = new PHPMailer(true);

    $Username = $config['email_username'];
    $password = $config['email_password'];
    $name = $config['email_name'];
    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username = $Username;
    $mail->Password = $password;
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

    $recpiant_email = $email;
    $recpiant_name = "Playboy User";

    // Sender and recipient
    $mail->setFrom($Username, $name);
    $mail->addAddress($recpiant_email, $recpiant_name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message;

    $mail->send();
    return true;
    }
    return false;
?>
