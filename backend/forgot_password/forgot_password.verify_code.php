<?php

include "forgot_password.php";
include "../data_base.php";

if( isset( $_POST["verify"] ) ) // once we click verify...
{
    $email = $_POST["email"];
    
    if( !isset( $_POST["code"] ) ) 
    {
        header("location:forgot_password.php?error=codenotentered&email=" . $email);
    }

    $code_entered = $_POST["code"];

    $sql = "SELECT id FROM users WHERE email = '$email'";
    $result = mysqli_query( $conn, $sql );

    $row = mysqli_fetch_assoc( $result );

    $user_id = $row["id"];

    $sql = "SELECT id FROM password_resets WHERE user_id = '$user_id'";
    $result = mysqli_query( $conn, $sql );

    if ( mysqli_num_rows( $result ) > 0 ) 
    {
        $row = mysqli_fetch_assoc( $result );

        $correct_code = $row["code"];
        echo "$correct_code<br>";

        if( $code_entered != $correct_code ) 
        {
            header("location:forgot_password.verify_email_send_code.php?error=codeenterednotcorrect");
        }

        header("location:reset_password.php?email=" . $email);
    }
    else 
    {
        header("location:forgot_password.php?error=sendnotpressed&email=" . $email);
    }
}
else
{
    header("location:forgot_password.php");
}