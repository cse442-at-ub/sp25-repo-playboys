import React from "react";
import { useNavigate } from 'react-router-dom';
import MainContent from "../../MainContent";
import Sidebar from "../../user_profile/Sidebar";
import { useCSRFToken } from '../../csrfContent';
import "../Settings.css"; // Import the CSS file

const DeleteAccount: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [delete_account, setDelete_account] = React.useState("");
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const csrfToken = useCSRFToken().csrfToken;
    
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
                    'CSRF-Token': csrfToken,
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
        <MainContent>
            <Sidebar />
            <div className="settings-page">
                <div className="settings-auth-container">
                    <div className="settings-header">
                        <div className="settings-header-text">
                            <button className="settings-back-button btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                        </div>
                    </div>
                    <div className="settings-login-box">
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

                            <button className="settings-delete-button" type="submit">Delete Account</button>
                            {error && <p className="settings-error-message">{error}</p>}
                        </form>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="settings-modal-overlay">
                        <div className="settings-modal-box">
                            <h3>Account Deleted</h3>
                            <p>Your account has been successfully deleted.</p>
                            <button onClick={handleModalClose}>OK</button>
                        </div>
                    </div>
                )}
            </div>
        </MainContent>
    );
};

export default DeleteAccount;
