import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ProfileHeader() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const user = searchParams.get("user"); // Extract ?user= from URL

    const [profile, setProfile] = useState<any>(null);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [friendStatus, setFriendStatus] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // Prevent multiple clicks

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
    }, [user]); // Refetch only when `user` changes

    // Function to send friend request
    const sendFriendRequest = async () => {
        if (!profile || isLoading) return;

        setIsLoading(true); // Disable button to prevent multiple clicks
        setFriendStatus("pending"); // Optimistic UI update

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/addFriends.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ potential_friend: profile.username }),
            });

            const result = await response.json();

            if (result.status === "sent") {
                setFriendStatus("pending"); // Revert if request fails
               
            }else if(result.status === "friends") {
                setFriendStatus("friends");
            }
            else if (result.status === "error") {
                setFriendStatus("none"); // Revert if request fails
                console.error("Error sending request:", result.message);
    
            }
        } catch (err) {
            setFriendStatus("none"); // Revert if network error occurs
            console.error("⚠️ Network error:", err);
        } finally {
            setIsLoading(false); // Re-enable button
        }
    };

    return (
        <div className="row">
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
                            <button className="btn btn-secondary btn-lg mt-4 px-5">🖋️ Edit Profile</button>
                        ) : (
                            <>
                                <button className="btn btn-primary btn-lg mt-4 mx-2">➕ Follow</button>

                                {friendStatus === "none" && (
                                    <button className="btn btn-success btn-lg mt-4" onClick={sendFriendRequest} disabled={isLoading}>
                                        🤝 Add Friend
                                    </button>
                                )}

                                {friendStatus === "pending" && (
                                    <button className="btn btn-warning btn-lg mt-4" disabled>
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
    );
}

export default ProfileHeader;



