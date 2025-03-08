import React from "react";
import "./forgot.css";

const ResetPassword: React.FC = () => {

    const [password, setPassword] = React.useState("");
    const [confpassword, setConfPassword] = React.useState("");
    const [error, setError] = React.useState("");
    
    const handleSubmit = async (e: React.FormEvent) => 
    {
        console.log(password);
        console.log(confpassword);
        window.location.href = "#/";
    }

  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Reset Password</h2>
            <form onSubmit={ handleSubmit }>
                <label>Password</label>
                <input type="password" placeholder="Enter your new password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm your new password" value={confpassword} onChange={(e) => setConfPassword(e.target.value)} />
                <button type="submit">Confirm</button>
                { error && <p className="error-message">{error}</p>}
            </form>
        </div>
    </div>
  );
};

export default ResetPassword;