import React from "react";
import "./forgot.css";

const ForgotPassword: React.FC = () => {
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Register</h2>
            <form>
                <label>Email</label>
                <input type="text" placeholder="Enter your email" />
                <button type="submit">Send</button>
            </form>
            <br></br>
            <form>
                <label>Verification Code</label>
                <input type="text" placeholder="Enter the code sent to your email" />
                <button type="submit">Send</button>
            </form>
        </div>
    </div>
  );
};

export default ForgotPassword;
