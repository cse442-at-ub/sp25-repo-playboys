<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include '../data_base.php'; // I'd make sure this points where it's supposed to

$data = json_decode(file_get_contents("php://input"), true); // I don't know if this is how to do this...

if ( !isset( $data['code'] ) ) 
{
    echo json_encode(["error" => "a code is required"]);
    exit();
}

// Your cookie authentication business... I wonder how that'll fit in here? I wish I could help more

$code_entered = $conn->real_escape_string( $data['code'] ); // Is conn->real_escape gonna work?

$sql = "SELECT id FROM password_resets WHERE user_id = '$user_id'";
$result = mysqli_query( $conn, $sql );

if( mysqli_num_rows( $result ) > 0 ) 
{
    $row = mysqli_fetch_assoc( $result );

    $correct_code = $row["code"];

    if( $code_entered != $correct_code ) 
    {
        echo json_encode(["error" => "Reset code entered is incorrect"]);
    }

    echo json_encode( ["success" => true, "message" => "Reset code is valid"] );
}
else 
{
    echo json_encode(["error" => "Reset code entered is not in database"]);
}

$conn->close();