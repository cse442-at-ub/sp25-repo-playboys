<?php

include('reset_password.php');
include('../data_base.php');

if( isset( $_POST["confirm"] ) ) 
{
    $email = $_POST["email"];

    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];

    // verify passwords entered are valid
    if( $confirm_password != $password )
    {
        header("location: reset_password.php?error=passwordsentereddonotmatch");
        exit();
    }

    $sql = "SELECT id FROM users WHERE email = '$email'";
    $result = mysqli_query( $conn, $sql );

    $row = mysqli_fetch_assoc( $result );

    $user_id = $row["id"];

    echo "$user_id<br>";

    $current_time = date("Y-m-d H:i:s", strtotime("+0 hour") );

    echo "$current_time<br>";

    $sql = "SELECT expires FROM password_resets WHERE user_id = '$user_id'";
    $result = mysqli_query( $conn, $sql );

    $row = mysqli_fetch_assoc( $result );

    $expires = $row["expires"];

    echo "$expires<br>";

    if( $expires >= $current_time ) 
    {
        $sql = "UPDATE users SET password='$password' WHERE id = '$user_id'";
        $result = mysqli_query( $conn, $sql );

        $sql = "DELETE FROM password_resets WHERE id = '$user_id'";
        $result = mysqli_query( $conn, $sql );

        header( "location:forgot_password.php?error=passwordupdated" );
        exit();
    }
    else 
    {
        header( "location:forgot_password.php?error=codeexpired" );
        exit();
    }
}
else 
{
    header("location: reset_password.php" );
}


function changePassword($conn, $password) 
{
    
}