import React from "react";
// import "./register.css";
import "./MobileDeleteAccount.css";
import { useNavigate } from 'react-router-dom';

const MobileAccountDeletion: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm_password, setconfirm_password] = React.useState("");
    const [error, setError] = React.useState("");
    const [delete_account, setDelete_account] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        // to implement
    };

    const navigate = useNavigate();
    const handleBackButton = () => {
      console.log("Show all clicked");
      navigate("/settings/account");
          
    };
        

  return (
    <div className="settings-page">
        <div className="auth-container">
            <div className="settings-header">
                <div className="settings-header-text">
                    <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                    <span>Account Deletion</span>
                </div>
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
    </div>
  );
};

export default MobileAccountDeletion;
