<?php
// Sset allowed HTTP methods
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Include database connection
include 'db.php';

// Get the raw JSON data sent from the frontend
$data = json_decode(file_get_contents("php://input"), true);

// Check if required fields are set in the request
if (isset($data['id'], $data['username'], $data['email'])) {
    // Update user details
    $sql = "UPDATE users SET username = ?, email = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $data['username'], $data['email'], $data['id']);
    
    // Execute query and send response
    if ($stmt->execute()) {
        echo json_encode(["message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["error" => "Failed to update profile"]);
    }
    
    // Close statement
    $stmt->close();
} else {
    // Return an error if required data is missing
    echo json_encode(["error" => "Invalid input"]);
}

// Close database connection
$conn->close();
?>