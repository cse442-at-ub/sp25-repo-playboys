import React from "react";
import { useNavigate } from 'react-router-dom';

const SettingsPrivacy: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [delete_account, setDelete_account] = React.useState("");
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (delete_account.toLowerCase() !== "confirm") {
            setError("You must type 'Confirm' to proceed.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/account_functions/deleteAccount.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.status === "success") {
                setShowSuccessModal(true);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
            console.error(err);
        }
    };

    const handleBackButton = () => {
        navigate("/settings/account");
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        navigate("/");
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
                    <h4>To delete your account please enter all the information correctly</h4>
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />

                        <label>Email</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

                        <label>Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

                        <label>Please Type "Confirm"</label>
                        <input type="text" value={delete_account} onChange={(e) => setDelete_account(e.target.value)} />

                        <button type="submit">Delete Account</button>
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Account Deleted</h3>
                        <p>Your account has been successfully deleted.</p>
                        <button onClick={handleModalClose}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPrivacy;
