import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCSRFToken } from "../../csrfContent";
const FriendRequests = () => {
    const [pendingFriends, setPendingFriends] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { csrfToken } = useCSRFToken();
    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}getFriendRequestsList.php`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
            });

            const result = await response.json();
            if (result.status === "success") {
                setPendingFriends(result.pendingFriends || []);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("Failed to fetch friend requests.");
            console.error("⚠️ Error:", err);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const acceptFriendRequest = async (friendUsername: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
                body: JSON.stringify({ friend: friendUsername, "choice": "accepted" }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setPendingFriends(pendingFriends.filter(name => name !== friendUsername));
            } else {
                console.error("Error accepting request:", result.message);
            }
        } catch (err) {
            console.error("⚠️ Network error:", err);
        }
    };

    const declineFriendRequest = async (friendUsername: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
                body: JSON.stringify({ friend: friendUsername, "choice": "declined" }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setPendingFriends(pendingFriends.filter(name => name !== friendUsername));
            } else {
                console.error("Error declining request:", result.message);
            }
        } catch (err) {
            console.error("⚠️ Network error:", err);
        }
    };

    const navigate = useNavigate();
    const handleBackButton = () => {
        console.log("Friend Request Page Selected");
        navigate("/settings/community");
    };

    return (
        <div className="settings-page">
            <div className="auth-container">
                <div className="settings-header">
                    <div className="settings-header-text">
                        <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
                        <span>Friend Requests</span>
                    </div>
                </div>
                <div className="login-box">
                    <h2 className="mb-4">Pending Friend Requests</h2>
                    {error && <p className="text-danger">{error}</p>}
                    {pendingFriends.length > 0 ? (
                        <ul className="list-group">
                            {pendingFriends.map((friend, index) => (
                                <li key={index} className="list-group-item d-flex flex-wrap justify-content-between align-items-center">
                                    <span className="font-weight-bold mb-2 mb-md-0">{friend}</span>
                                    <div className="d-flex flex-wrap justify-content-center">
                                        <button className="btn btn-success btn-sm me-md-2 mb-2 mb-md-0" onClick={() => acceptFriendRequest(friend)}>
                                            <i className="bi bi-check-lg"></i> Accept
                                        </button>
                                        <button className="btn btn-danger btn-sm mb-2 mb-md-0" onClick={() => declineFriendRequest(friend)}>
                                            <i className="bi bi-x-lg"></i> Decline
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No pending friend requests.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequests;





