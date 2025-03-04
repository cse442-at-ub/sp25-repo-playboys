<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// COMPOSER REQUIRE CODE: 
// require '../../vendor/autoload.php';
// DOWNLOADED ZIP CODE:

require '../../phpmailer/src/Exception.php'; // THIS WAS A HEADACHE! Make sure these line up perfectly. It may be very deceiving
require '../../phpmailer/src/PHPMailer.php';
require '../../phpmailer/src/SMTP.php';

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

        echo 'Message has been sent';
    } 
    catch ( Exception $e ) 
    {
        echo 'Message could not be sent';
    }
}
?>
