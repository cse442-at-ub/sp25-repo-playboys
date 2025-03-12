<?php
    require __DIR__ . "/headers.php";
    require __DIR__ . "/mailer.php";

    $data = json_decode(file_get_contents("php://input"), true); // Not sure of this, new to me
    
    if ( empty( $data[ "code" ] ) ) 
    {
        echo json_encode([
            "status" => "error",
            "message" => "Please enter the code you received in your email to continue."
        ]);
        exit();
    }

    $email = $data[ "email" ];
    $code_entered = $data[ "code" ];

    // Try to get users id for request w/ correct code
    $get_users_id = $conn->prepare( "SELECT id FROM user_login_data WHERE email = ?" );
    $get_users_id->bind_param("s", $email);
    $get_users_id->execute();

    $result = $get_users_id->get_result();
    if( $result->num_rows > 0 ) 
    {
        $users_id = $result->fetch_assoc()["id"];
    }
    else 
    {
        echo json_encode([ "status" => "error", "error" => "Could not find user. Please try again." ] );
    }

    // We have users id, now try to get their reset pwd request
    $current = date( "Y-m-d H:i:s", strtotime( "+0 hour" ) );

    $get_forgot_pwd_request = $conn->prepare( "SELECT * FROM pwd_reset_requests WHERE users_id = ? AND expires >= ?" );
    $get_forgot_pwd_request->bind_param( "is", $users_id, $current );
    $get_forgot_pwd_request->execute();
    
    $result = $get_forgot_pwd_request->get_result();
    if( $result->num_rows > 0 )
    {
        $correct_code = $result->fetch_assoc()["code"];

        // Have we entered the right code?
        if( strcmp( $code_entered, $correct_code ) <> 0 ) 
        {
            echo json_encode([ "status" => "error", "message" => "Code entered is incorrect. Please try again." ] );
            exit();
        }

        // We have!
        echo json_encode( [ "status" => "success", "message" => "Code entered is correct." ] );
    } 
    else 
    {
        echo json_encode( [ "status" => "error", "message"=> "Could not find request. Did you click 'send'? Please try again." ] );
    }
?>