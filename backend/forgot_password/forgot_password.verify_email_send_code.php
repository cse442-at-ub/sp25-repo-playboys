<?php

if( isset($_POST[ "send" ] ) ) // make sure we're coming from forgot_password.php
{
    $email = $_POST["email"];

    // check for / test formatting
    if( !validEmail($email) ) 
    {
        header("location: forgot_password.php?error=emailenteredinvalid");
        exit();
    }

    // check if email is in database
    if( !emailExists($conn, $email) ) // do we have a connection??? Is this all I need?
    {
        header("location: forgot_password.php?error=emailentereddoesnotexist");
        exit();
    }

    // send a code to said email

    // send us back
    header("location:forgot_password.php?error=none"); // email sent
}
else // we're not, the url was likely modified by the user
{
    header("location: forgot_password.php"); // send them back
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

function emailExists($conn, $email)
{
    $email_exists_conn = $conn->prepare("SELECT * FROM register WHERE email = ?");
    $email_exists_conn->bind_param("s", $email);
    $email_exists_conn->execute();
    $result = $email_exists_conn->get_result();
    
    if($result->num_rows === 0) {
        return false;
    }

    return true;
}