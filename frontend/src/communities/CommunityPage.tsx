import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";
import { useCSRFToken } from "../csrfContent";

interface Community {
  name: string;
  background_image: string;
}

const CommunityPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();

  const [community, setCommunity] = useState<Community | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  // Modal States
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}backend/custom_communities/getCommunityById.php?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
          }
        );

        const result = await res.json();
        if (result.name) {
          setCommunity(result);
        } else {
          setError(result.message || "Community not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load community");
      }
    };

    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}backend/getProfile.php`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "CSRF-Token": csrfToken,
            },
            credentials: "include",
          }
        );
        const result = await res.json();
        if (result.status === "success") {
          setLoggedInUser(result.loggedInUser);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchCommunity();
    fetchUser();
  }, [id, csrfToken]);

  if (error) {
    return (
      <div className="community-page">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>{error}</h2>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="community-page">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <h2>Loading...</h2>
      </div>
    );
  }

  const handleCreate = () => {
    console.log("Creating post:", postCaption, postImage);
    setShowCreatePost(false);
    setPostCaption("");
    setPostImage(null);
  };

  return (
    <div className="community-page">
      <button className="back-button" onClick={() => navigate(-1)}>←</button>

      <div className="community-header">
        <img
          className="background-image"
          src={
            community.background_image ||
            process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg"
          }
          alt="Community Background"
        />
        <h1 className="community-name">{community.name}</h1>
      </div>

      {/* Floating + Button */}
      <button className="floating-add-btn" onClick={() => setShowCreatePost(true)}>+</button>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="create-post-modal">
          <div className="create-post-box">
            <div className="post-header">
              <img
                src={process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"}
                className="profile-pic"
                alt="pfp"
              />
              <input
                className="caption-input"
                type="text"
                placeholder="Enter caption"
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                maxLength={250}
              />
            </div>

            <div
              className="image-upload"
              onClick={() => document.getElementById("post-image-upload")?.click()}
            >
              {postImage ? (
                <img src={postImage} className="uploaded-image" alt="Post Preview" />
              ) : (
                <p>Click to upload Image</p>
              )}
              <input
                type="file"
                id="post-image-upload"
                style={{ display: "none" }}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setPostImage(event.target?.result as string);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="create-post-buttons">
              <button className="cancel-btn" onClick={() => setShowCreatePost(false)}>Cancel</button>
              <button className="create-btn" onClick={handleCreate}>Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
