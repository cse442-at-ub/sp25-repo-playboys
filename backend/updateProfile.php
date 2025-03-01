<?php
// Allow requests from any origin
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuth.php";

$user = $result->fetch_assoc();
$username = $user["username"];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try{
        $stmt = $conn->prepare("SELECT username, email FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        echo json_encode(["status" => "success", "data" => $user]);
        exit();
    }catch(Exception $e){
        echo json_encode(["status" => "error", "message" => "Invalid Request Error"]);
        exit();
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data["email"]) || !isset($data["username"])) {
        echo json_encode(["status" => "error", "message" => "All fields are required."]);
        exit();
    }
    $newEmail = trim($data["email"]);
    $newUsername = trim($data["username"]);
    $stmt = $conn->prepare("SELECT * FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $newUsername);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "User already exist. Please choose another username."]);
        exit();
    }

    $stmt = $conn->prepare("SELECT * FROM user_profiles WHERE email = ?");
    $stmt->bind_param("s", $newEmail);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email already in use. Please choose another email."]);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE user_profiles SET email = ?, username = ? WHERE username = ?");
        $stmt->bind_param("sss", $newEmail, $newUsername, $username);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE user_login_data SET email = ?, username = ? WHERE username = ?");
        $stmt->bind_param("sss", $newEmail, $newUsername, $username);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE cookie_authentication SET username = ? WHERE username = ?");
        $stmt->bind_param("ss", $newUsername, $username);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        echo json_encode(["status" => "success", "message" => "Profile updated successfully"]);
        exit();
    }
    catch (Exception $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update profile"]);
        exit();
    }

}else{
    echo json_encode(["status" => "error", "message" => "Invalid Request Method"]);
    exit();


}




?>