<?php
    require "backend/data_base.php";
    require "backend/user_auth.php";

    // Set CORS headers at the top
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json"); // Ensure JSON response

    // Handle preflight (OPTIONS) requests
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(200);
        exit();
    }

    // Debugging only (optional):
    // echo $requested_uri;

    $requested_uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH); // e.g. "/register"

    // Allowed routes
    $allowed_route = [
        "/" => ["GET"],
        "/register" => ["POST"],
        "/login" => ["POST"]
    ];

    $method = $_SERVER["REQUEST_METHOD"]; // e.g. "POST"
    $data = json_decode(file_get_contents("php://input"), true); // decode JSON body

    // Check if the route & method are allowed
    if (!array_key_exists($requested_uri, $allowed_route) || !in_array($method, $allowed_route[$requested_uri])) {
        echo json_encode(["status" => "error", "message" => "Invalid Request"]);
        http_response_code(403);
        exit();
    }
    //paths 
    if($requested_uri === "/") {
        readfile("test_register_login.html");
        exit();
    }
    else if($requested_uri ==="/register") {
        register($conn, $data);
    }
    else if($requested_uri === "/login") {
        login($conn, $data);
    } 



?>


