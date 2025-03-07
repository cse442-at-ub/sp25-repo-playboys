<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../data_base.php';

$data = json_decode(file_get_contents("php://input"), true); // Idk if this is the way to go...

if ( !isset( $data['password'] ) || !isset( $data['confirm_password'] ) ) 
{
    echo json_encode( ["error" => "Reset code and new passwords are required"] );
    exit();
}

$password = $conn->real_escape_string( $data['password'] ); // Idk if conn->real... is the way to go...
$confirm_password = $conn->real_escape_string( $data['confirm_password'] );

if( $confirm_password != $password ) 
{
    echo json_encode( ["error" => "Passwords do not match"] );
    exit();
}

$new_password = password_hash( $conn->real_escape_string($data['password'] ), PASSWORD_DEFAULT);

// IMPORTANT: GET user's 'id' so we can identify them! 
// I do this with the 'hidden' '_POST' stuff in my code, 
// but I imagine you have some different way of going about this with cookies.
// I imagine I need it next, in order to know whose password to reset!

$current_time = date("Y-m-d H:i:s", strtotime("+0 hour") );

// If we got here, we shouldn't need to 'if-statement' this... 
// I don't in my working code, and I don't want to give you something I haven't tested...
// Let me know if I need to change it to handle that error! Should be easy
$sql = "SELECT expires FROM password_resets WHERE user_id = '$user_id'";
$result = mysqli_query( $conn, $sql );

$row = mysqli_fetch_assoc( $result );

$expires = $row["expires"];

if( $expires >= $current_time ) 
{
    $sql = "UPDATE users SET password='$password' WHERE id = '$user_id'";
    $result = mysqli_query( $conn, $sql );

    $sql = "DELETE * FROM password_resets WHERE id = '$user_id'";
    $result = mysqli_query( $conn, $sql );

    echo json_encode( ["success" => true, "message" => "Password has been reset"] );
}
else 
{
    $sql = "DELETE * FROM password_resets WHERE id = '$user_id'";
    $result = mysqli_query( $conn, $sql );

    echo json_encode( ["error" => "Entered reset code has expired, please try again"] );
}

$conn->close();