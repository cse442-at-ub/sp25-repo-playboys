<?php
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    //header("Access-Control-Allow-Credentials: true"); // Only if using cookies
    header("Content-Type: application/json");
    
    $method = $_SERVER["REQUEST_METHOD"]; // e.g. "POST"
        // Handle preflight (OPTIONS) requests
    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
            http_response_code(200);
            exit();
    }
    require __DIR__ . "/data_base.php";
?>