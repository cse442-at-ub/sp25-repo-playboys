<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
    </head>
    <body>
        <div>
            <h2>Verify Email</h2>
            <form action="forgot_password.verify_email_send_code.php" method="post">
                <input type="email" name="email" placeholder="Enter your email here...">
                <button type="submit" name="send">Send</button>
            </form>
            <?php // error handling for email entered
                if( isset( $_GET["error"] ) )
                {
                    if( $_GET["error"] == "none" ) {
                        echo "<p>Email sent.</p>";
                    }
                    else if( $_GET["error"] == "emailenteredinvalid" ) {
                        echo "<p>The email you have entered is invalid. Please try again.</p>";
                    }
                    else if( $_GET["error"] == "emailentereddoesnotexist" ) {
                        echo "<p>The email you have entered does not belong to an account. Please try again.</p>";
                    }
                }
             ?>
            <form action="forgot_password.verify_code.php" method="post"></form>
                <input type="text" name="code" placeholder="Enter the oce you've received here...">
                <button type="submit" name="verify">Verify</button>
            </form>
            <?php // error handling for code entered
                if( isset( $_GET["error"] ) )
                {
                    // if( $_GET["error"] == "codeenteredincorrect" ) {
                    //     echo "<p>The code you have entered is incorrect. Please try again.</p>";
                    // }
                }
             ?>
        </div>
    </body>
</html>