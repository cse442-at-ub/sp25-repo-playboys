<?php
// Allow requests from any origin
//this file should not be called since it has an response use cookieAuth.php instead

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require __DIR__ . "/headers.php";


if(!isset($_COOKIE["auth_token"])){
    echo json_encode(["status" => "error", "message" => "NO key, Please login"]);

    exit();    
}
try{

    //grab and check the auth token from the cookie
    $auth_token = $_COOKIE["auth_token"];
    $stmt_cookie = $conn->prepare("SELECT username FROM cookie_authentication WHERE auth_key = ?");
    $stmt_cookie->bind_param("s", $auth_token);
    $stmt_cookie->execute();
    $result = $stmt_cookie->get_result();
    if($result->num_rows == 0){
        echo json_encode(["status" => "error", "message" => "Invalid Cookie"]);
        exit();

    }
    echo json_encode(["status" => "success", "message" => "Logged in"]);
    exit();
}catch(Exception $e){
    echo json_encode(["status" => "error", "message" => "Please Login"]);

    exit();
}

?>