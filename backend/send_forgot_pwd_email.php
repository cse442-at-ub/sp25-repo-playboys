<?php

    require __DIR__ . "/headers.php";
    
    require '../../util/mailer.php'; // I'd make sure these are correct 

    $method = $_SERVER["REQUEST_METHOD"];
    $data = json_decode(file_get_contents("php://input"), true); // Not sure of this, new to me

    if ( empty( $data[ "email" ] ) ) 
    {
        echo json_encode( [
            "status" => "error",
            "error" => "An email is required"
        ]);
        exit();
    }

    $email = $data['email']; 

    if( !isValidEmail($email) ) 
    {
        echo json_encode( [
            "status"=> "error",
            "error" => "The email address entered is not a valid email"
        ]);
        exit();
    }

    try 
    {
        $sql = "SELECT id FROM users WHERE email = '$email'";
        $result = mysqli_query( $conn, $sql );

        if ( mysqli_num_rows( $result ) > 0 ) 
        {
            $row = mysqli_fetch_assoc( $result );

            $user_id = $row["id"];

            $code = bin2hex(random_bytes(4)); // 16 -> 4

            $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

            $sql = "INSERT INTO password_resets (user_id, code, expires) 
                    VALUES ('$user_id', '$code', '$expires')";
            $result = mysqli_query( $conn, $sql );

            sendEmail(   $email, 
                    "Team Playboys Reset Password", 
                    "<p>Your code is: '$code'<br><br>Expires in 1 hour.</p>" );

            echo json_encode( [
                "success" => true, 
                "message" => "Password reset email sent"
            ]);
        } 
        else 
        {
            echo json_encode([
                "status" => "error",
                "error" => "The email address entered could not be found in the database"
            ]);
        }
    
    }
    catch( Exception $e ) 
    {
        echo json_encode([
            "status" => "error",
            "error" => "An error occurred while connecting to the database"
        ]);
    }

    function isValidEmail( $email ) 
    {
        return preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $email );
    }