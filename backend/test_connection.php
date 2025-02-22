<?php
$conn = new mysqli("127.0.0.1", "root", "", "user_login_information", 3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully!";
?>
