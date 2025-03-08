import React from "react";
import "./forgot.css";

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = React.useState("");
    const [code, setCode] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");


    const handleVerifyEmailSendCode = async (e: React.FormEvent) => 
    {
        console.log(email);
    }

    const handleVerifyCode = async (e: React.FormEvent) => 
    {
        console.log(code);
        window.location.href = "#/forgot/reset";
    }
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Verify Email</h2>
            <form onSubmit={ handleVerifyEmailSendCode }>
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={ email } onChange={ (e) => setEmail( e.target.value ) }/>
                <button type="submit">Send</button>
                { error && <p className="error-message">{ error }</p> }
            </form>
            <br></br>
            <form onSubmit={ handleVerifyCode }>
                <label>Verification Code</label>
                <input type="text" placeholder="Enter the code sent to your email" value={ code } onChange={ ( e ) => setCode( e.target.value ) }/>
                <button type="submit">Verify</button>
                { error && <p className="error-message">{ error }</p> }
            </form>
        </div>
    </div>
  );
};

export default ForgotPassword;
