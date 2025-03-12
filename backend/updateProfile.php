<?php
// Allow requests from any origin and check if user is logged in
require __DIR__ . "/headers.php";
require __DIR__ . "/cookieAuthHeader.php";
require __DIR__ . "/userDatabaseGrabber.php";

$user = $result->fetch_assoc();
$username = $user["username"];
$email = "";
$data = json_decode(file_get_contents("php://input"), true); // decode JSON body
//retreive user information from the database for update profile page
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try{
        $stmt = $conn->prepare("SELECT username, email, profile_pic FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        if($result->num_rows == 0){
            echo json_encode(["status" => "error", "message" => "Invalid Request Error"]);
            exit();
        }
        $email = $user["email"];
        
        echo json_encode(["status" => "success", "data" => $user]);
        exit();
    }catch(Exception $e){
        echo json_encode(["status" => "error", "message" => "Invalid Request Error"]);
        exit();
    }

} 

//update user profile information
else if ($_SERVER['REQUEST_METHOD'] === 'POST') {  
    //grab old email
    $stmt = $conn->prepare("SELECT email FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $email = $user["email"];
    $newEmail = trim($data["email"]);

    //grab potential new email from forntend json 
    $newUsername = trim($data["username"]);
    if(strlen($newUsername) > 15){
        echo json_encode(["status" => "error", "message" => "Username too long, Please try again!"]);
        exit();
    }
    if ((!isset($data["email"]) || !isset($data["username"]))) {
        echo json_encode(["status" => "success", "message" => "All input remains."]);
        exit();
    }
    if(($newEmail == "" || $newUsername == "")){
        echo json_encode(["status" => "same", "message" => "All input remains."]);
        exit();
    }


    if(!isValidEmail($newEmail)){
        echo json_encode(["status" => "error", "message" => "Email Invalid. Please try again."]);
        exit();
    }
    if(strlen($newEmail) > 254){
        echo json_encode(["status" => "error", "message" => "Email is invalid, Please try again!"]);
        exit();
    }
    //check if new email is the same as the old, if not check if it is in use
    if($newEmail != $email){
        $stmt = $conn->prepare("SELECT * FROM user_profiles WHERE email = ?");
        $stmt->bind_param("s", $newEmail);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "Email already in use. Please choose another email."]);
            exit();
        }
    
    }

    //check if new username is the same as the old, if not check if it is in use
    if($newUsername != $username){
        $stmt = $conn->prepare("SELECT * FROM user_profiles WHERE username = ?");
        $stmt->bind_param("s", $newUsername);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            echo json_encode(["status" => "error", "message" => "User already exist. Please choose another username."]);
            exit();
        }
    }


    //check if new email and usernames are the same
    if ($newEmail == $email && $newUsername == $username) {
        echo json_encode(["status" => "success", "message" => "All input remains."]);
        exit();
    }


    try {
        //update email and username in user_profiles
        $stmt = $conn->prepare("UPDATE user_profiles SET email = ?, username = ? WHERE username = ?");
        $stmt->bind_param("sss", $newEmail, $newUsername, $username);
        $stmt->execute();
        //update email and username in user login data
        $stmt = $conn->prepare("UPDATE user_login_data SET email = ?, username = ? WHERE username = ?");
        $stmt->bind_param("sss", $newEmail, $newUsername, $username);
        $stmt->execute();
        //updated username in cookie auth
        $stmt = $conn->prepare("UPDATE cookie_authentication SET username = ? WHERE username = ?");
        $stmt->bind_param("ss", $newUsername, $username);
        $stmt->execute();
        //update username in friend pairs database
        $stmt = $conn->prepare("UPDATE friend_pairs SET username = ? WHERE username = ?");
        $stmt->bind_param("ss", $newUsername, $username);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE friend_pairs SET friend = ? WHERE friend = ?");
        $stmt->bind_param("ss", $newUsername, $username);
        $stmt->execute();
        $stmt = $conn->prepare("UPDATE friend_pairs SET requester = ? WHERE requester = ?");
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