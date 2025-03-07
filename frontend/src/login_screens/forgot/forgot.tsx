import React from "react";
import "./forgot.css";
import {send_forgot_pwd_email } from "./api/forgot_pwd_apis";

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = React.useState("");
    const [code, setCode] = React.useState("");
    const [emailMessage, setEmailMessage] = React.useState("");
    const [codeMessage, setCodeMessage] = React.useState("");
    const [emailError, setEmailError] = React.useState("");
    const [codeError, setCodeError] = React.useState("");

    
    const handleEmailSubmit = async (e: React.FormEvent) => 
    {
        e.preventDefault();
        const data = {email};
        console.log( data );
    
        try 
        {
          const response = await send_forgot_pwd_email( email );
          setEmailMessage( response );
        } 
        catch ( err: any ) 
        {
          setEmailError( err.message );
        }
    };

    const handleCodeSubmit = async (e: React.FormEvent) => 
    {
        e.preventDefault();
        const data = {email};
        console.log( data );
    
        try 
        {
            const response = await send_forgot_pwd_email( email );
            setCodeMessage( response );
        } 
        catch ( err: any ) 
        {
            setCodeError( err.message );
        }
    };
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Forgot Password</h2>
            <form onSubmit={ handleEmailSubmit }>
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={ ( e ) => setEmail( e.target.value ) }/>
                <button type="submit">Send</button>
                { emailError && <p className="error-message">{ emailError }</p> }
            </form>
            <br></br>
            <form onSubmit={ handleCodeSubmit }>
                <label>Verification Code</label>
                <input type="text" placeholder="Enter the code sent to your email" value={code} onChange={ ( e ) => setCode( e.target.value ) }/>
                <button type="submit">Send</button>
                { codeError && <p className="error-message">{ codeError }</p> }
            </form>
        </div>
    </div>
  );
};

export default ForgotPassword;
