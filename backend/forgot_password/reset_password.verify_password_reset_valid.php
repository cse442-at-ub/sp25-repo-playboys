<?php

if( isset( $_POST["confirm"] ) ) 
{
    $password = $_POST["confirm"];
    $confirm_password = $_POST["confirm_password"];

    // verify passwords entered are valid
    if( !passwordsValid( $password, $confirm_password ) )
    {
        header("location: reset_password.php?error=passwordsenteredinvalid");
    }

    // change password
    changePassword( $conn, $password );
}
else 
{
    header("location: reset_password.php" );
}

function passwordsValid($password, $confirm_password) 
{
    if( $confirm_password == $password ) 
    {
        return true;
    }
    return false;
}

function changePassword($conn, $password) 
{
    
}