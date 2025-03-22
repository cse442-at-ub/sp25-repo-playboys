import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Heading, PrimaryButton, SecondaryButton, Colors, FontSizes, Spacing } from '../style_guide';

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

  useEffect(() => {
    // fetch profile logic...
  }, [user]);

  const sendFriendRequest = async () => { /* request logic */ };
  const acceptFriendRequest = async (friendUsername: string) => { /* accept logic */ };

  return (
    <div className="container">
      {pendingFriends.length > 0 && (
        <div className="d-flex justify-content-center mt-3">
          <div className="dropdown">
            <button className="btn btn-outline-primary dropdown-toggle w-100" type="button" onClick={() => setShowDropdown(!showDropdown)}>
              Pending Friend Requests ({pendingFriends.length})
            </button>
            {showDropdown && (
              <ul className="dropdown-menu show w-100">
                {pendingFriends.map((friend, index) => (
                  <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                    {friend}
                    <PrimaryButton onClick={() => acceptFriendRequest(friend)}>✅ Accept</PrimaryButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="row mt-4 align-items-center text-center text-md-start">
        <div className="col-12 col-md-4 d-flex justify-content-center">
          <img src={profileImageUrl || "./static/ProfilePlaceholder.png"} alt="Profile" className="img-fluid rounded-circle mt-3" style={{ maxWidth: "150px", height: "auto" }} />
        </div>
        <div className="col-12 col-md-8 mt-3 mt-md-0">
          {profile ? (
            <>
              <Heading level={2}>{profile.username}</Heading>
              <h2 className="h5 text-muted">@{profile.username}</h2>
              <p className="h6 mt-2">{profile.friends} Friends • {profile.followers} Followers • {profile.followings} Following</p>
              <div className="d-flex flex-column flex-md-row justify-content-center justify-content-md-start mt-3">
                {profile.username === loggedInUser ? (
                  <SecondaryButton onClick={() => navigate("/edit-profile")}>
                    🖋️ Edit Profile
                  </SecondaryButton>
                ) : (
                  <>
                    <PrimaryButton onClick={() => {}}>➕ Follow</PrimaryButton>
                    {friendStatus === "none" && (
                      <PrimaryButton onClick={sendFriendRequest} disabled={isLoading}>🤝 Add Friend</PrimaryButton>
                    )}
                    {friendStatus === "pending" && (
                      <SecondaryButton onClick={sendFriendRequest} disabled={isLoading}>⏳ Pending Request</SecondaryButton>
                    )}
                    {friendStatus === "friends" && (
                      <SecondaryButton disabled>✅ Friends</SecondaryButton>
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