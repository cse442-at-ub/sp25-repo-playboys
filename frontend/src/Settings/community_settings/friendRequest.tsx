import { useState, useEffect } from "react";

const FriendRequests = () => {
    const [pendingFriends, setPendingFriends] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchFriendRequests = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/getFriendRequestsList.php`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
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

    return (
        <div className="settings-page">
            <div className="auth-container">
                <div className="settings-header">
                    <div className="settings-header-text">
                        <span className="menu-icon">☰</span>
                        <span>Settings - Account - Friend Requests</span>
                    </div>
                    <button className="back-button" onClick={() => window.location.href = "#/settings/account"}>
                        🔙
                    </button>
                </div>
                <div className="login-box">
                    <h2>Pending Friend Requests</h2>
                    {error && <p className="error-message">{error}</p>}
                    {pendingFriends.length > 0 ? (
                        <div className="friend-requests-list">
                            {pendingFriends.map((friend, index) => (
                                <div key={index} className="friend-request-row">
                                    <span className="friend-name">{friend}</span>
                                    <div className="friend-actions">
                                        <button className="accept-button" onClick={() => acceptFriendRequest(friend)}>
                                            ✓ Accept
                                        </button>
                                        <button className="decline-button" onClick={() => declineFriendRequest(friend)}>
                                            ✗ Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No pending friend requests.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FriendRequests;





