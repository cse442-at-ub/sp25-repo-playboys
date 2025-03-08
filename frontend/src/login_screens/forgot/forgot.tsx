import React from "react";
import "./forgot.css";

const ForgotPassword: React.FC = () => {

    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Email Reset</h2>
            <form>
                <label>Email</label>
                <input type="text" placeholder="Enter your email" />
                <button type="submit">Send</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <br></br>
            <form>
                <label>Verification Code</label>
                <input type="text" placeholder="Enter the code sent to your email" />
                <button type="submit">Send</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    </div>
  );
};

export default ForgotPassword;
