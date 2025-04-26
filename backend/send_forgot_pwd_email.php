<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/cookieAuthHeader.php";
    require __DIR__ . '/config.php'; // Include your database connection file

    $data = json_decode(file_get_contents("php://input"), true); // Not sure of this, new to me

    if( empty( $data[ "email" ] ) ) 
    {
        echo json_encode( [ "status" => "error", "message" => "Please enter an email address." ] );
        exit();
    }

    $email = $data['email']; 

    if( !isValidEmail( $email ) ) 
    {
        echo json_encode([  "status" => "error", "message" => "The email you've entered is invalid. Please enter a valid email address." ] );
        exit();
    }

    // Try to find user
    $get_users_id = $conn->prepare( "SELECT id FROM user_login_data WHERE email=?" );
    $get_users_id->bind_param( "s", $email );
    $get_users_id->execute();

    $result = $get_users_id->get_result();
    if( $result->num_rows > 0) 
    {
        $users_id = $result->fetch_assoc()["id"];
    }
    else 
    {
        echo json_encode( [
            "status" => "error", 
            "message" => "Could not find user. Please try again."
        ]);
        exit();
    }

    $get_users_id->close();

    // User exists. Now, try to send email, request reset 
    $code = strtoupper( bin2hex(random_bytes( 4 ) ) );
    $expires = date("Y-m-d H:i:s", strtotime("+1 hour"));

    try 
    {
        $create_request = $conn->prepare( "INSERT INTO pwd_reset_requests (users_id, code, expires)  VALUES (? , ? , ?)" );
        $create_request->bind_param( "iss", $users_id, $code, $expires );
        $create_request->execute();

        sendEmail(   $email, "Team Playboys Reset Password", "<p>Your code is: '$code'<br><br>Expires in 1 hour.</p>" );

        echo json_encode( [
            "status" => "success", 
            "message" => "Email sent. Please check your inbox."
        ]);

        $create_request->close();
    }
    catch( Exception $e ) 
    {
        echo json_encode( [
            "status" => "error", 
            "message" => "Could not send email. Please try again."
        ]);
    }

    // This'll likely never be called... the field is an 'email' field... it requires this implicitly...
    function isValidEmail( $email ) 
    {
        return preg_match("/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/", $email );
    }
?>