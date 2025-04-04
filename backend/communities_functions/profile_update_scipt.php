<?php
require __DIR__ . "/../headers.php";

// Connect to the database
// Assuming $conn is your MySQL connection

// Query to get all users where Communities is NULL or empty
$query = "SELECT username, Communities FROM user_profiles WHERE Communities IS NULL OR Communities = ''";

$result = $conn->query($query);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $username = $row['username'];
        $communities = json_encode([]); // Initialize as an empty JSON array

        // Update the Communities field for this user
        $stmt = $conn->prepare("UPDATE user_profiles SET Communities = ? WHERE username = ?");
        $stmt->bind_param("ss", $communities, $username);
        $stmt->execute();
    }
    echo "Old accounts updated successfully!";
} else {
    echo "No accounts need updating.";
}

?>