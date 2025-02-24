<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Forgot Password</title>
    </head>
    <body>
        <div>
            <h2>Password reset</h2>
            <form action="reset_password.verify_password_reset_valid.php" method="post">
                <input type="password" name="password" placeholder="Enter your new password...">
                <input type="password" name="confirm_password" placeholder="Confirm your new password...">
                <button type="submit" name="confirm">Confirm</button>
            </form>
            <?php // error handling for password entered
                if( isset( $_GET["error"] ) )
                {
                    if( $_GET["error"] == "none" ) {
                        echo "<p>Password reset</p>";
                    }
                }
             ?>
        </div>
    </body>
</html>