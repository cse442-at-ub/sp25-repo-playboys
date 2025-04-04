<?php
require_once "headers.php"; // If not already included
require __DIR__ . "/cookieAuthHeader.php";

// Database connection




// Get and sanitize the search query from the URL
$searchQuery = isset($_GET['searchQuery']) ? $_GET['searchQuery'] : '';
$user = $result->fetch_assoc();
$login_username = $user["username"];
$data = [];
if (!empty($searchQuery)) {
    // Add wildcards to enable partial matches
    $searchPattern = '%' . $conn->real_escape_string($searchQuery) . '%';

    // Prepare the SQL query with LIKE for flexible matching
    $sql = "SELECT username 
            FROM user_login_data
            WHERE username LIKE ? LIMIT 10";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        // Bind the parameter
        $stmt->bind_param("s", $searchPattern);

        // Execute the query
        $stmt->execute();

        // Get the result
        $result = $stmt->get_result();

        // Fetch all results into an associative array
        $results = $result->fetch_all(MYSQLI_ASSOC);

        // Return the results as JSON
        foreach(array_reverse($results) as $row){
            $user_info = [];
            $stmt = $conn->prepare("SELECT profile_pic FROM user_profiles WHERE username = ?");
            $username = $row["username"];
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {

                $profile = $result->fetch_assoc();
                $user_info["name"] = $username;
                $user_info["image"] = $profile["profile_pic"];
                $user_info["login_user"] = $login_username;

    
                $data[] = $user_info;
            }
        }
        echo json_encode($data);

        // Close the statement
        $stmt->close();
    } else {
        echo json_encode(["error" => "Failed to prepare the SQL statement"]);
    }
} else {
    // Return an empty array if no search query is provided
    echo json_encode([]);
}


?>
