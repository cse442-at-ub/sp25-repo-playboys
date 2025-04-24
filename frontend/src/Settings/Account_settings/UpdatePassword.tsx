import React from "react";
import { useNavigate } from 'react-router-dom';
import MainContent from "../../MainContent";
import Sidebar from "../../user_profile/Sidebar";
import { useCSRFToken } from '../../csrfContent';
import "../Settings.css"; // Import the CSS file




const SettingsPrivacy: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const csrfToken = useCSRFToken().csrfToken;

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/account_functions/verifyCredentials.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'CSRF-Token': csrfToken,
            },
            body: JSON.stringify({
                username,
                email,
                password,
            }),
            credentials: 'include'
        });
        const result = await response.json();
        if (result["status"] != "success") {
            setError(result["message"]);
            return;
        }
        const response2 = await fetch(`${process.env.REACT_APP_API_URL}backend/account_functions/updatePassword.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'CSRF-Token': csrfToken,
            },
            body: JSON.stringify({
                username,
                newPassword,
                newPassword2: confirmNewPassword,
            }),
            credentials: 'include'
        });
        const result2 = await response2.json();
        if (result2["status"] != "success") {
            setError(result["message"]);
            return;
        }
        setShowSuccessModal(true);
    };

    const handleBackButton = () => {
        navigate("/settings/account");
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate("/");
    };

    return (
        <MainContent>
        <div className="settings-page">
            <div className="auth-container"> 
                <div className="settings-header">
                    <div className="settings-header-text">
                        <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                    </div>
                </div>                   
                <div className="login-box" style={{padding: "20px"}}>
                    <h2>Update Password</h2>
                    <h4>To Update Your Password Enter your Current Username, Email, and password. Then enter your new password</h4>
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />

                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <ul>
                            Password must meet the following requirements:
                            Have at least 8 characters
                            Have at least 1 uppercase characters
                            Have at least 1 special character (!@#$%^&*)
                        </ul>
                        <label>New Password</label>
                        <input type="password" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Confirm your new password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

                        <button type="submit">Update Password</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="settings-modal-overlay">
                    <div className="settings-modal-box">
                        <h3>Password Updated</h3>
                        <p>Your password has been successfully updated.</p>
                        <button onClick={handleModalClose}>OK</button>
                    </div>
                </div>
            )}
        
        </div>
        <Sidebar></Sidebar>
        </MainContent>
    );
};

export default SettingsPrivacy;
