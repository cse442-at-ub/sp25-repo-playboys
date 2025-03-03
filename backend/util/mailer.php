<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';

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

        return true;
    } 
    catch ( Exception $e ) 
    {
        return false;
    }
}
echo "mailer.php included!"
?>
