<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../data_base.php';

$data = json_decode(file_get_contents("php://input"), true);

if ( !isset( $data['code'] ) ) 
{
    echo json_encode(["error" => "a code is required"]);
    exit();
}

$code = $conn->real_escape_string( $data['code'] );

// Gotta be a better, more secure way to do this... better authenticate the user...
$query = "SELECT user_id FROM password_resets WHERE code = '$code' AND expires > NOW()";
$result = $conn->query($query);

if ($result->num_rows > 0) 
{
    echo json_encode(["success" => true, "message" => "Code is valid"]);
} 
else 
{
    echo json_encode(["error" => "Incorrect, invalid, or expired reset code"]);
}

$conn->close();