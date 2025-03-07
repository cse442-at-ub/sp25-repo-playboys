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
            {/* Pending Friend Requests - Mobile Friendly */}
            {pendingFriends.length > 0 && (
                <div className="d-flex justify-content-center mt-3">
                    <div className="dropdown">
                        <button 
                            className="btn btn-outline-primary dropdown-toggle w-100" 
                            type="button" 
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            Pending Friend Requests ({pendingFriends.length})
                        </button>
                        {showDropdown && (
                            <ul className="dropdown-menu show w-100">
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
                </div>
            )}

            {/* Profile Header - Mobile Adjustments */}
            <div className="row mt-4 align-items-center text-center text-md-start">
                <div className="col-12 col-md-4 d-flex justify-content-center">
                    <img 
                        src="./static/ProfilePlaceholder.png" 
                        alt="Profile" 
                        className="img-fluid rounded-circle mt-3" 
                        style={{ maxWidth: "150px", height: "auto" }}
                    />
                </div>
                <div className="col-12 col-md-8 mt-3 mt-md-0">
                    {profile ? (
                        <>
                            <h1 className="h3">{profile.username}</h1>
                            <h2 className="h5 text-muted">@{profile.username}</h2>
                            <p className="h6 mt-2">
                                {profile.friends} Friends • {profile.followers} Followers • {profile.followings} Following
                            </p>

                            {/* Action Buttons */}
                            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-start mt-3">
                                {profile.username === loggedInUser ? (
                                    <button className="btn btn-secondary btn-sm mt-2 mt-md-0 mx-1" onClick={() => navigate("/edit-profile")}>
                                        🖋️ Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button className="btn btn-primary btn-sm mt-2 mt-md-0 mx-1">➕ Follow</button>

                                        {friendStatus === "none" && (
                                            <button className="btn btn-success btn-sm mt-2 mt-md-0 mx-1" onClick={sendFriendRequest} disabled={isLoading}>
                                                🤝 Add Friend
                                            </button>
                                        )}

                                        {friendStatus === "pending" && (
                                            <button className="btn btn-warning btn-sm mt-2 mt-md-0 mx-1" onClick={sendFriendRequest} disabled={isLoading}>
                                                ⏳ Pending Request
                                            </button>
                                        )}

                                        {friendStatus === "friends" && (
                                            <button className="btn btn-secondary btn-sm mt-2 mt-md-0 mx-1" disabled>
                                                ✅ Friends
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
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




