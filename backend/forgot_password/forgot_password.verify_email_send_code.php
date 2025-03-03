<?php

include('forgot_password.php');
include('../data_base.php');
include('../util/mailer.php');

if( isset( $_POST[ "send" ] ) ) 
{
    $email = $_POST["email"];

    if( !validEmail($email) ) 
    {
        header("location: forgot_password.php?error=emailenteredisnotvalid");
        exit();
    }

    $sql = "SELECT id FROM users WHERE email = '$email'";
    $result = mysqli_query( $conn, $sql );

    if ( mysqli_num_rows( $result ) > 0 ) 
    {
        $row = mysqli_fetch_assoc( $result );

        $user_id = $row["id"];

        $code = bin2hex(random_bytes(4)); // 16 -> 4

        $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

        $sql = "INSERT INTO password_resets (user_id, code, expires) 
                VALUES ('$user_id', '$code', '$expires')";
        $result = mysqli_query( $conn, $sql );

        sendEmail(   $email, 
                "Team Playboys Reset Password", 
                "Your code is: '$code'\n\nExpires in 1 hour." );

        header("location: forgot_password.php?error=none&email=" . $email);
    } 
    else 
    {
        header("location: forgot_password.php?error=emailenteredisnotindatabase");
        exit();
    }
}
else // we're not, the url was likely modified by the user
{
    header("location:forgot_password.php"); // send them back
}

function validEmail($email) 
{
    if( empty($email) ) // might be unnecessary
    { 
        return false;
    }
    if( preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $email) )
    { 
        return true;
    }
    return false;
}