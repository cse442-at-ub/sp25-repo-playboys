import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ProfileHeader() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = searchParams.get("user");

    const [profile, setProfile] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [friendStatus, setFriendStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingFriends, setPendingFriends] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php?user=${user || ""}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (result.status === "success") {
                setLoggedInUser(result.loggedInUser);
                setProfile(result.profile);
                setFriendStatus(result.friendStatus);
                setPendingFriends(result.pendingFriends || []);
            } else {
                setError(result.message);
                navigate("/login");
            }
        } catch (err) {
            setError("Failed to fetch profile data.");
            console.error("⚠️ Error:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const sendFriendRequest = async () => {
        if (!profile || isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/addFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ potential_friend: profile.username }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setFriendStatus("pending");
            } else if (result.status === "retract") {
                setFriendStatus("none");
            } else if (result.status === "friends") {
                setFriendStatus("friends");
            } else if (result.status === "error") {
                setFriendStatus("none");
                console.error("Error sending request:", result.message);
            }
        } catch (err) {
            setFriendStatus("none");
            console.error("⚠️ Network error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const acceptFriendRequest = async (friendUsername: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ friend: friendUsername, "choice": "accept" }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setPendingFriends(pendingFriends.filter(name => name !== friendUsername)); // Remove from pending list
    
                // Increase friend count in real-time
                setProfile((prevProfile: any) => ({
                    ...prevProfile,
                    friends: prevProfile.friends + 1,
                }));
            }  else {
                console.error("Error accepting request:", result.message);
            }
        } catch (err) {
            console.error("⚠️ Network error:", err);
        }
    };

    return (
        <div className="container">
            {/* Dropdown for Pending Friend Requests */}
            <div className="d-flex justify-content-end mt-3">
                {pendingFriends.length > 0 && (
                    <div className="dropdown">
                        <button 
                            className="btn btn-outline-primary dropdown-toggle" 
                            type="button" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            Pending Friend Requests ({pendingFriends.length})
                        </button>
                        {showDropdown && (
                            <ul className="dropdown-menu show position-absolute" style={{ right: 0 }}>
                                {pendingFriends.map((friend, index) => (
                                    <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                                        {friend}
                                        <button className="btn btn-success btn-sm" onClick={() => acceptFriendRequest(friend)}>
                                            ✅ Accept
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {/* Profile Header Section */}
            <div className="row mt-4">
                <div className="col-md-4">
                    <img src="./static/ProfilePlaceholder.png" alt="Profile" className="img-fluid rounded-circle mt-3" />
                </div>
                <div className="col-md-8">
                    {profile ? (
                        <>
                            <h1 className="display-4">{profile.username}</h1>
                            <h2 className="mt-3">@{profile.username}</h2>
                            <p className="h4 mt-3">
                                {profile.friends} Friends • {profile.followers} Followers • {profile.followings} Following
                            </p>

                            {profile.username === loggedInUser ? (
                                <button className="btn btn-secondary btn-lg mt-4 px-5" onClick={() => navigate("/edit-profile")}>🖋️ Edit Profile</button>
                            ) : (
                                <>
                                    <button className="btn btn-primary btn-lg mt-4 mx-2">➕ Follow</button>

                                    {friendStatus === "none" && (
                                        <button className="btn btn-success btn-lg mt-4" onClick={sendFriendRequest} disabled={isLoading}>
                                            🤝 Add Friend
                                        </button>
                                    )}

                                    {friendStatus === "pending" && (
                                        <button className="btn btn-warning btn-lg mt-4" onClick={sendFriendRequest} disabled={isLoading}>
                                            ⏳ Pending Request
                                        </button>
                                    )}

                                    {friendStatus === "friends" && (
                                        <button className="btn btn-secondary btn-lg mt-4" disabled>
                                            ✅ Friends
                                        </button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <p className="text-danger mt-3">{error || "Loading..."}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfileHeader;





