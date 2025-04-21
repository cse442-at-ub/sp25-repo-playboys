import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from "../csrfContent";
import "./friendList.css";
import UserSearchBar from "../searchUser/searchUserBar";
interface Friend {
  name: string;
  image: string;
  status: string;
  login_user: string;
}

function FriendList() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const navigate = useNavigate();
  const handleBackButton = () => {
    navigate(-1); // Go back to the previous page
  };
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { csrfToken } = useCSRFToken();
  const [pendingFriends, setPendingFriends] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php?user=${user || ""}`, {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
          });
  
          const result = await response.json();
  
          if (result.status === "success") {
              setPendingFriends(result.pendingFriends || []);
          } else {
              
              navigate("/userprofile");
          }
      } catch (err) {
    
          console.error("⚠️ Error:", err);
      }
   };
    const fetchFriends = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/friendList.php?user=${(user && user !== "null") ? user : ""}`, {
          method: "POST",
          credentials: "include",
          headers: { 'page-source': "friendlist", 'CSRF-Token': csrfToken },
        });

        if (response.ok) {
          console.log(csrfToken);
          const data = await response.json();
          if (data.includes("error")) {
            console.log("Error fetching friends or user not authenticated");
          } else {
            setFriends(data); // Populate the friends list
            if(loggedInUser == null){
              setLoggedInUser(data[0]["login_user"]);
              console.log("logined in friend user: ", loggedInUser);
            }

          }
        } else {
          console.error("Error fetching friends:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    if (user === loggedInUser || user === "" || user === null) {
      fetchProfile();
    }
    fetchFriends();
  }, [csrfToken]);

  const sendFriendRequest = async (friendName: string, status: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/addFriends.php`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
            body: JSON.stringify({ potential_friend: friendName, status: status}),
        });

        const result = await response.json();
        if (result.status === "success") {
          let po_friend = friends.find(friend => friend.name == friendName);
          if (po_friend) {
            po_friend["status"] = "pending";
          }
        } else if (result.status === "retract") {
          let po_friend = friends.find(friend => friend.name == friendName);
          if (po_friend) {
            po_friend["status"] = "none";
          }
        } else if (result.status === "friends") {
          let po_friend = friends.find(friend => friend.name == friendName);
          if (po_friend) {
            po_friend["status"] = "friends";
          }
        } else if(result.status === "removed"){
          setFriends(prevFriends => prevFriends.filter(friend => friend.name !== friendName));
          // Make an API call to remove friend from the backend as well if necessary
          console.log(`unfriend: ${friendName}`);
        } else if(result.status === "other removed"){
          let po_friend = friends.find(friend => friend.name == friendName);
          if (po_friend) {
            po_friend["status"] = "none";
          }
          console.log(`unfriend: ${friendName}`);
        }
        else if (result.status === "error") {
          let po_friend = friends.find(friend => friend.name == friendName);
          if (po_friend) {
            po_friend["status"] = "none";
          }
            console.error("Error sending request:", result.message);
        }
    } catch (err) {
      let po_friend = friends.find(friend => friend.name == friendName);
      if (po_friend) {
        po_friend["status"] = "none";
      }
        console.error("⚠️ Network error:", err);
    } finally {
        setIsLoading(false);
    }
};


  const goToProfile = (friendName: string) => {
    // Redirect to the friend's profile page
    navigate(`/userprofile?user=${friendName || ""}`); 
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/friendList.php?user=${(user && user !== "null") ? user : ""}`, {
        method: "POST",
        credentials: "include",
        headers: { 'page-source': "friendlist", 'CSRF-Token': csrfToken },
      });

      if (response.ok) {
        console.log(csrfToken);
        const data = await response.json();
        if (data.includes("error")) {
          console.log("Error fetching friends or user not authenticated");
        } else {
          setFriends(data); // Populate the friends list
          if(loggedInUser == null){
            setLoggedInUser(data[0]["login_user"]);
            console.log("logined in friend user: ", loggedInUser);
          }

        }
      } else {
        console.error("Error fetching friends:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  const declineFriendRequest = async (friendUsername: string) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/acceptFriends.php`, {
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
          fetchFriends();
      } else {
          console.error("Error accepting request:", result.message);
      }
  } catch (err) {
      console.error("⚠️ Network error:", err);
  }
};

  return (
    <div className="friendlist-container">
      <div className="friendlist-header">
        <button className="friendlist-back-button" aria-label="Go back" onClick={handleBackButton}>←</button>
        <h2 className="friendlist-title">
          {user === loggedInUser || user === "" || user === null ? "My Friends" : `${user}'s Friends`}
        </h2>
        <div className="friendlist-search-bar-container">
          <UserSearchBar onSearch={(query) => console.log("Searching for:", query)} />
        </div>
      </div>
      

      <div className="friendlist">
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
                  <ul
                  className="dropdown-menu show px-2 py-2"
                  style={{ minWidth: "auto", width: "100%" }}
                >
                  {pendingFriends.map((friend, index) => (
                    <li
                      key={index}
                      className="dropdown-item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        paddingBottom: "0.5rem",
                        borderBottom: "1px solid #e9ecef",
                        width: "100%",
                      }}
                    >
                      <div
                        onClick={() => goToProfile(friend)}
                        className="fw-semibold text-primary mb-1"
                        style={{ cursor: "pointer", wordBreak: "break-word", width: "100%" }}
                      >
                        {friend}
                      </div>
                
                      <div className="d-flex w-100 justify-content-between">
                        <button
                          className="btn btn-success btn-sm px-2 py-1"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => acceptFriendRequest(friend)}
                        >
                          ✅ Accept
                        </button>
                        <button
                          className="btn btn-danger btn-sm px-2 py-1"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => declineFriendRequest(friend)}
                        >
                          ❌ Decline
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                
              )}
          </div>
      </div>
      )}
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
              {!user || user==loggedInUser ? (
                <button className="remove-friend-btn" onClick={() => sendFriendRequest(friend.name, "unfriend")} disabled={isLoading}>
                  Remove Friend
                </button>
              ) : (
                <>

                {friend.status === "none" && friend.name != loggedInUser && (
                    <button className="btn btn-success btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest(friend.name, "add")} disabled={isLoading}>
                        🤝 Add Friend
                    </button>
                )}

                {friend.status === "pending" && (
                    <button className="btn btn-warning btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest(friend.name, "pending")} disabled={isLoading}>
                        ⏳ Pending Request
                    </button>
                )}

                {friend.status === "friends" && (
                    <button className="btn btn-danger btn-sm mt-2 mt-md-0 mx-1" onClick={() => sendFriendRequest(friend.name, "other unfriend")} disabled={isLoading}>
                        unfriend
                    </button>
                )}
            </>
              )}
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




