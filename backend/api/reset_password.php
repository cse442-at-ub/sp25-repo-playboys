<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../data_base.php';

$data = json_decode(file_get_contents("php://input"), true);

if ( !isset( $data['code'] ) || !isset( $data['password'] ) || !isset( $data['confirm_password'] ) ) 
{
    echo json_encode( ["error" => "Reset code and new passwords are required"] );
    exit();
}

$code = $conn->real_escape_string( $data['code'] );
$password = $conn->real_escape_string( $data['password'] );
$confirm_password = $conn->real_escape_string( $data['confirm_password'] );

if( $confirm_password != $password ) 
{
    echo json_encode( ["error" => "Passwords do not match"] );
    exit();
}

$new_password = password_hash( $conn->real_escape_string($data['password'] ), PASSWORD_DEFAULT);

$query = "SELECT user_id FROM password_resets WHERE code = '$code' AND expires > NOW()";
$result = $conn->query($query);

if ( $result->num_rows > 0 ) 
{
    $user = $result->fetch_assoc();
    $user_id = $user['user_id'];

    //                   UPDATE the main table  so as to... update the password to the new one for THIS user
    $conn->query("UPDATE users SET password = '$new_password' WHERE id = '$user_id'");

    //                   DELETE the password_resets table entry for the now completed code
    $conn->query("DELETE FROM password_resets WHERE user_id = '$user_id'");

    echo json_encode(["success" => true, "message" => "Reset password"] );
} 
else 
{
    echo json_encode(["error" => "Invalid or expired code"]);
}

$conn->close();
?>
