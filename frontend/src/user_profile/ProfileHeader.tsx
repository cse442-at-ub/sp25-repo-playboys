import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCSRFToken } from '../csrfContent';

function ProfileHeader() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = searchParams.get("user");

    const [profile, setProfile] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [friendStatus, setFriendStatus] = useState<string | null>(null);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [pendingFriends, setPendingFriends] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { csrfToken } = useCSRFToken();

    const fetchProfile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php?user=${user || ""}`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
            });

            const result = await response.json();

            if (result.status === "success") {
                setLoggedInUser(result.loggedInUser);
                setProfile(result.profile);
                setProfileImageUrl(result.profile_pic);
                setFriendStatus(result.friendStatus);
                setPendingFriends(result.pendingFriends || []);
            } else {
                setError(result.message);
                navigate("/userprofile");
            }
        } catch (err) {
            setError("Failed to fetch profile data.");
            console.error("⚠️ Error:", err);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const sendFriendRequest = async (status: string) => {
        if (!profile || isLoading) return;
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/addFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
                body: JSON.stringify({ potential_friend: profile.username, status: status }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setFriendStatus("pending");
            } else if (result.status === "retract") {
                setFriendStatus("none");
            } else if (result.status === "friends") {
                setFriendStatus("friends");
            } else if (result.status === "removed"){
                setFriendStatus("none");
            } 
            else if (result.status === "error") {
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

    const handleFriendClick = () => {
        navigate(`/friendlist?user=${user || ""}`);
    };

    const acceptFriendRequest = async (friendUsername: string) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/acceptFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
                body: JSON.stringify({ friend: friendUsername, "choice": "accept" }),
            });

            const result = await response.json();
            if (result.status === "success") {
                setPendingFriends(pendingFriends.filter(name => name !== friendUsername));
                setProfile((prevProfile: any) => ({
                    ...prevProfile,
                    friends: prevProfile.friends + 1,
                }));
            } else {
                console.error("Error accepting request:", result.message);
            }
        } catch (err) {
            console.error("⚠️ Network error:", err);
        }
    };
    const goToProfile = (friendName: string) => {
        // Redirect to the friend's profile page
        navigate(`/userprofile?user=${friendName || ""}`); 
      };

    return (
        <div className="container">
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
                                    <li key={index} className="dropdown-item d-flex justify-content-between align-items-center" >
                                        <div onClick={() => goToProfile(friend) } style={{ cursor: "pointer" }}>
                                            {friend}
                                        </div>
                                        
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

            <div className="row mt-4 align-items-center text-center text-md-start">
                <div className="col-12 col-md-4 d-flex justify-content-center">
                    <img
                        src={profileImageUrl || "./static/ProfilePlaceholder.png"}
                        alt="Profile"
                        className="img-fluid rounded-circle mt-3"
                        style={{ maxWidth: "150px", height: "150px" }}
                    />
                </div>
                <div className="col-12 col-md-8 mt-3 mt-md-0">
                    {profile ? (
                        <>
                            <h1 className="h3">{profile.username}</h1>
                            <h2 className="h5 text-muted">@{profile.username}</h2>
                            <p className="h6 mt-2">
                                <span
                                    onClick={handleFriendClick}
                                    style={{
                                        cursor: "pointer",
                                        transition: "filter 0.3s, transform 0.3s, color 0.3s, background-color 0.3s", // Added transitions for color and background-color
                                        padding: "0 5px", // Added padding to make background more visible
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.filter = "brightness(0.6)"; // Darker shade
                                        e.currentTarget.style.transform = "scale(1.05)"; // Slight zoom on hover
                                        e.currentTarget.style.color = "#000000"; // Change text color on hover (black text)
                                        e.currentTarget.style.backgroundColor = "#f0f0f0";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.filter = "brightness(1)"; // Reset brightness
                                        e.currentTarget.style.transform = "scale(1)"; // Reset zoom effect
                                        e.currentTarget.style.color = ""; // Reset to original color
                                        e.currentTarget.style.backgroundColor = ""; // Reset background color
                                    }}
                                    >
                                    {profile.friends} Friends
                                </span>
                                • {profile.followers} Followers • {profile.followings} Following
                            </p>

                            <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-start mt-3">
                                {profile.username === loggedInUser ? (
                                    <button className="btn btn-secondary btn-sm mt-2 mt-md-0 mx-1" onClick={() => navigate("/edit-profile")}>
                                        🖋️ Edit Profile
                                    </button>
                                ) : (
                                    <>
                                        <button className="btn btn-primary btn-sm mt-2 mt-md-0 mx-1">➕ Follow</button>

                                        {friendStatus === "none" && (
                                            <button className="btn btn-success btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest("add")} disabled={isLoading}>
                                                🤝 Add Friend
                                            </button>
                                        )}

                                        {friendStatus === "pending" && (
                                            <button className="btn btn-warning btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest("pending")} disabled={isLoading}>
                                                ⏳ Pending Request
                                            </button>
                                        )}

                                        {friendStatus === "friends" && (
                                            <button className="btn btn-danger btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest("unfriend")} disabled={isLoading}>
                                                unfriend
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







