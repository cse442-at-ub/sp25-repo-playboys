import React from "react";
import "./forgot.css";
import {resetPassword } from "./api/forgot_pwd_apis";

const ForgotPassword: React.FC = () => {

    const [password, setPassword] = React.useState("");
    const [confirm_password, setConfirmPassword] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {password, confirm_password};
        console.log( data );
    
        try 
        {
          const response = await resetPassword( password, confirm_password );
          setMessage( response );
        } 
        catch ( err: any ) 
        {
          setError( err.message );
        }
    };
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Reset Password</h2>
            <form onSubmit={ handleSubmit }>
                <label>Email</label>
                <input type="password" placeholder="Enter your new password" value={password} onChange={ ( e ) => setPassword( e.target.value ) }/>
                <input type="password" placeholder="Confirm your new password" value={password} onChange={ ( e ) => setConfirmPassword( e.target.value ) }/>
                <button type="submit">Send</button>
                { error && <p className="error-message">{ error }</p> }
            </form>
        </div>
    </div>
  );
};

export default ForgotPassword;
