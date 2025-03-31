<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// COMPOSER REQUIRE CODE: 
// require '../vendor/autoload.php';
// DOWNLOADED ZIP CODE:

require '../phpmailer/src/Exception.php';
require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';

function sendEmail( $to, $subject, $message) 
{
    $mail = new PHPMailer(true);

    try 
    {
        $mail->isSMTP();
        $mail->SMTPAuth = true;

        $mail->Host = 'smtp.gmail.com'; 
        $mail->Username = 'emailer.teamplayboys@gmail.com';
        $mail->Password = 'bama vtyb twre hddu';
        
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('mailer-teamplayboys@gmail.com', 'Team Playboys');
        $mail->addAddress( $to );
        $mail->isHTML( true );
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
    } 
    catch ( Exception $e ) 
    {
        json_encode([
            "status"=> "error",
            "message" => "in mailer.php: Email could not be sent"
        ]);
        exit();
    }
}
?>