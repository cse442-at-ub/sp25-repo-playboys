<?php

    require __DIR__ . "/headers.php";

    $data = json_decode(file_get_contents("php://input"), true);

    if ( empty( $data[ "password" ] ) || empty( $data[ "confirmPassword" ] ) ) 
    {
        echo json_encode( [ "status" => "error", "message" => "Please enter your new password" ] );
        exit();
    }

    $email = $data[ "decodedEmail" ];
    $password = $data[ "password" ];
    $confirm_password = $data[ "confirmPassword" ];

    if( $password !== $confirm_password ) 
    {
        echo json_encode( [ "status" => "error", "message" => "Passwords do not match. Please try again." ] );
        exit();
    }
    
    // Try to find users id
    $get_users_id = $conn->prepare("SELECT id FROM user_login_data WHERE email = ?");
    $get_users_id->bind_param( "s", $email );
    $get_users_id->execute();

    $result = $get_users_id->get_result();
    if( $result->num_rows > 0 ) 
    {
        $users_id = $result->fetch_assoc()["id"];
    }
    else
    {
        echo json_encode([
            "status" => "error",
            "message"=> "Could not find user. Please try again."
        ]);
        exit();
    }

    $get_users_id->close();

    // Have users id, is request valid?
    $current = date("Y-m-d H:i:s", strtotime("+0 hour") );

    $get_request_id = $conn->prepare("SELECT request_id FROM pwd_reset_requests WHERE users_id = ? AND expires >= ?");
    $get_request_id->bind_param( "is", $users_id, $current );
    $get_request_id->execute();

    $result = $get_request_id->get_result();
    if( $result->num_rows > 0 ) 
    {
        $request_id = $result->fetch_assoc()["id"];
    }
    else
    {
        echo json_encode([
            "status" => "error",
            "message"=> "Could not find request. Please try again."
        ]);
        exit();
    }

    // Try to UPDATE pwd
    $new_password = password_hash( $password, PASSWORD_DEFAULT );

    try 
    {
        $reset_pwd = $conn->prepare( "UPDATE user_login_data SET password = ? WHERE id = ?" );
        $reset_pwd->bind_param("si", $new_password, $users_id );
        $reset_pwd->execute();
    }
    catch( Exception $e )
    {
        echo json_encode([
            "status" => "error",
            "message"=> "Could not update password. Please try again."
        ]);
        exit();
    }

    // Try to DELETE reset request
    try 
    {
        $remove_pwd_reset_request = $conn->prepare( "DELETE FROM pwd_reset_requests WHERE request_id = ?" );
        $remove_pwd_reset_request->bind_param("i", $request_id );
        $remove_pwd_reset_request->execute();

        echo json_encode([
            "status" => "success",
            "message"=> "Password reset successful."
        ]);
        exit();
    }
    catch( Exception $e ) 
    {
        echo json_encode([
            "status" => "error",
            "message"=> "Could not remove reset request. Please try again."
        ]);
        exit();
    }
?>