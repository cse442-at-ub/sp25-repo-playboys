import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from "../csrfContent";
import "./friendList.css";

interface Friend {
  name: string;
  image: string;
}

function FriendList() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const navigate = useNavigate();
  const handleBackButton = () => {
    navigate(-1); // Go back to the previous page
  };

  const [friends, setFriends] = useState<Friend[]>([]);
  const { csrfToken } = useCSRFToken();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/friendList.php?user=${user}`, {
          method: "POST",
          credentials: "include",
          headers: { 'page-source': "friendlist", 'CSRF-Token': csrfToken },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.includes("error")) {
            console.log("Error fetching friends or user not authenticated");
          } else {
            setFriends(data); // Populate the friends list
          }
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, [csrfToken]);

  const removeFriend = (friendName: string) => {
    // Handle removing a friend here (e.g., make an API call)
    console.log(`Remove friend: ${friendName}`);
  };

  const goToProfile = (friendName: string) => {
    // Redirect to the friend's profile page
    navigate(`/userprofile?user=${friendName || ""}`); 
  };

  return (
    <div className="friendlist-container">
      <div className="friendlist-header">
        <button className="friendlist-back-button" aria-label="Go back" onClick={handleBackButton}>←</button>
        <h2 className="friendlist-title">Friends</h2>
      </div>

      <div className="friendlist">
        {friends.length > 0 ? (
          friends.map((friend, i) => (
            <div key={i} className="friend-item">
              <div
                className="friend-avatar-container"
                onClick={() => goToProfile(friend.name)} // Redirect to the friend's profile
                style={{ cursor: "pointer" }}
              >
                <img
                  src={friend.image || "./static/ProfilePlaceholder.png"}
                  alt={friend.name}
                  className="friend-avatar"
                  onError={(e) => e.currentTarget.src = "./static/ProfilePlaceholder.png"}
                />
              </div>
              <div
                className="friend-name"
                onClick={() => goToProfile(friend.name)} // Redirect to the friend's profile
                style={{ cursor: "pointer" }}
              >
                {friend.name}
              </div>
              <button className="remove-friend-btn" onClick={() => removeFriend(friend.name)}>
                Remove Friend
              </button>
            </div>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
}

export default FriendList;




