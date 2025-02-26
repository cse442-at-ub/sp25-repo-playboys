<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../data_base.php';
include '../utils/mailer.php';

$data = json_decode(file_get_contents("php://input"), true);

if ( !isset( $data['email'] ) ) 
{
    echo json_encode( ["error" => "email is required"] );
    exit();
}

$email = $conn->real_escape_string($data['email'] );

// Check if user exists
$query = "SELECT id FROM users WHERE email = '$email'";
$result = $conn->query( $query );

if ( $result->num_rows > 0 )
{
    $user = $result->fetch_assoc();
    $user_id = $user['id'];

    $code = bin2hex(random_bytes(4)); // 16 -> 4

    $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

    $conn->query("INSERT INTO password_resets (user_id, token, expires) VALUES ('$user_id', '$code', '$expires')");

    // util/mailer.php
    // sendEmail($email, "Playboys Password Reset Code", "Your code is: '$code'\n\nExpires in 1 hour.");

    echo json_encode(["success" => true, "message" => "Reset email sent"]);
} else 
{
    echo json_encode(["error" => "Email not found"]);
}

$conn->close();