<?php
// Allow CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Prevent output issues
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204); // No content for preflight
    exit();
}

// Only include database when needed
if ($_SERVER["REQUEST_METHOD"] !== "OPTIONS") {
    require __DIR__ . "/data_base.php";
}
?>
<?php
// Allow CORS