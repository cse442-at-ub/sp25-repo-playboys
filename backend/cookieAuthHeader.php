<?php
// Allow requests from any origin
require __DIR__ . "/headers.php";


if(!isset($_COOKIE["auth_token"])){
    echo json_encode(["status" => "error", "message" => "NO key, Please login"]);
    //return to the homepage if cookies are invalid/not found in our database 
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
        //return to the homepage if cookies are invalid/not found in our database 
        exit();
    
    }
}catch(Exception $e){
    echo json_encode(["status" => "error", "message" => "Please Login"]);
    //return to the homepage if cookies are invalid/not found in our database 
    exit();
}

?>