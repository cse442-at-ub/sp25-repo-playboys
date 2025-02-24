<?php

if( isset( $_POST["verify"] ) ) // make sure 
{
    $code_entered = $_POST["code"];


}
else
{
    header("location:forgot_password.php");
}