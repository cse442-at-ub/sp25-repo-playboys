import React from "react";
import "./mobile_forgot.css";

const MobileForgotPassword: React.FC = () => {

    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Register</h2>
            <form>
                <label>Email</label>
                <input type="text" placeholder="Enter your email" />
                <button type="submit">Send</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    </div>
  );
};

export default MobileForgotPassword;
