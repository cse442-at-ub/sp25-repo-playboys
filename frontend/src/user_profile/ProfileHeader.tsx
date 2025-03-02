import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProfileHeader() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null); //created profile state to store the profile data, setProfile to update the profile data
    const [error, setError] = useState<string | null>(null);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (result.status === "success") {
                setProfile(result.profile); //set the profile data into the profile state
            } else {
                setError(result.message);
                navigate('/login');

            }
        } catch (err) {
            setError("Failed to fetch profile data.");
            console.error("⚠️ Error:", err);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []); // Fetch profile when component mounts

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="row">
            <div className="col-md-4">
                <img
                    src="./static/ProfilePlaceholder.png"
                    alt="Profile"
                    className="img-fluid rounded-circle mt-3"
                />
            </div>
            <div className="col-md-8">
                <div className="d-flex flex-column align-items-start font-weight-bold text-dark">
                    {profile ? (
                        <>
                            <h1 className="display-4" style={{ fontSize: "4rem", fontWeight: "bold" }}>
                                {profile.username}
                            </h1>
                            <h2 className="mt-3" style={{ fontSize: "2rem" }}>@{profile.username}</h2>
                            <p className="h4 mt-3">
                                {profile.friends} <span>Friends </span>
                                {profile.followers} <span>Followers </span>
                                {profile.followings} <span>Following</span>
                            </p>
                            <button className="btn btn-secondary btn-lg mt-4 px-5" onClick={handleEditProfile}>
                                🖋️ Edit Profile
                            </button>
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


