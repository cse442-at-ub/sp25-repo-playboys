import React from "react";
// import "./register.css";

const SettingsPrivacy: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm_password, setconfirm_password] = React.useState("");
    const [error, setError] = React.useState("");
    const [delete_account, setDelete_account] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        // to implement
    };
        

  return (
    <div className="auth-container">
        <div className="header">
            <div className="header-text">
                <span className="menu-icon">☰</span>
                <span>Settings-Account-Delete Account</span>
            </div>
            <button className="back-button" onClick={() => window.location.href = "/settings/account"}>
                🔙
            </button>
        </div>
        <div className="login-box">
            <h2>Account Deletion</h2>
            <h4>To delete your account please enter all the information corectly</h4>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <label>Password</label>
                <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Please Type "Confirm"</label>
                <input type="text" value={delete_account} onChange={(e) => setDelete_account(e.target.value)} />
                <button type="submit" >Delete Account</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
    </div>
  );
};

export default SettingsPrivacy;
