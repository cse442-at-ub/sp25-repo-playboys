<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST"); // Is this correct?

include '../data_base.php';
include '../util/mailer.php'; // I'd make sure these are correct 

$data = json_decode(file_get_contents("php://input"), true); // Not sure of this, new to me

if ( !isset( $data['email'] ) ) 
{
    echo json_encode( ["error" => "email is required"] );
    exit();
}

$email = $conn->real_escape_string($data['email'] ); // Is this how you do it? conn->real_... or is there a mysqli we'd prefer?

if( !isValidEmail($email) ) 
{
    echo json_encode( ["error" => "email is not a valid email"] );
    exit();
}

// More testing funcs later maybe

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
            "<p>Your code is: '$code'<br><br>Expires in 1 hour.</p>" );

    echo json_encode( ["success" => true, "message" => "Password reset email sent"] );
} 
else 
{
    echo json_encode(["error" => "email could not be found in database"]);
}

mysqli_close( $conn ); // Is this necesary server-side? I didn't include it in my local one...

function isValidEmail( $email ) 
{
    return preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $email );
}

// More testing funcs later maybe