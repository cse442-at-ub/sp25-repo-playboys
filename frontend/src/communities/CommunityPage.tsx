import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();

  // Like and post modal states
  const [liked, setLiked] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postCaption, setPostCaption] = useState("");
  const [postImage, setPostImage] = useState<string | null>(null);

  // Placeholder background logic
  const community = {
    name: "Rock Lover",
    backgroundImage: "", // Leave empty to trigger placeholder
  };
  const placeholderBg =
    process.env.PUBLIC_URL + "/static/PlayBoysBackgroundImage169.jpeg";
  const backgroundImg = community.backgroundImage || placeholderBg;

  // Sample post
  const post = {
    username: "Username",
    profilePic:
      process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png",
    caption:
      "This is the caption text for the post. It has a max of 250 characters.",
    postImage: "", // Empty = no image
  };

  return (
    <div className="community-page">
      
      {!showCreatePost && (
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
      )}


      {/* Header */}
      <div className="community-header">
        <img
          className="background-image"
          src={backgroundImg}
          alt="Community Background"
        />
        <h1 className="community-name">{community.name}</h1>
      </div>

      {/* Single Post */}
      <div className="post">
        <div className="post-header">
          <img
            src={post.profilePic}
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{post.username}</span>
        </div>

        <div className="caption">{post.caption}</div>

        {post.postImage && (
          <img
            className="post-image"
            src={post.postImage}
            alt="Post"
          />
        )}

        <div className="controls">
          <button
            className={`heart-btn ${liked ? "liked" : ""}`}
            onClick={() => setLiked(!liked)}
          >
            <img
              src={
                liked
                  ? process.env.PUBLIC_URL + "/static/HeartIconLike.png"
                  : process.env.PUBLIC_URL + "/static/HeartIconUnlike.png"
              }
              alt="Like"
            />
          </button>
          <button className="comment-btn">
            <img
              src={
                process.env.PUBLIC_URL + "/static/CommentIcon.png"
              }
              alt="Comment"
            />
          </button>
        </div>

        {/* Comments */}
        <div className="comments-section">
          <div className="comment">
            <img
              src={
                process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"
              }
              alt="Commenter"
              className="comment-profile-pic"
            />
            <div className="comment-content">
              <span className="comment-username">User1</span>
              <p className="comment-text">
                This is a short comment, up to 100 characters max!
              </p>
            </div>
          </div>

          <div className="comment">
            <img
              src={
                process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"
              }
              alt="Commenter"
              className="comment-profile-pic"
            />
            <div className="comment-content">
              <span className="comment-username">User2</span>
              <p className="comment-text">
                Here's another example of a comment someone might write.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Button*/}
      <button
        className="floating-add-btn"
        onClick={() => setShowCreatePost(true)}>+
      </button>

      {/* Create Post Modal*/}
      {showCreatePost && (
        <div className="create-post-modal">
          <div className="create-post-box">
            <div className="post-header">
              <img
                src={
                  process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"
                }
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
              onClick={() =>
                document.getElementById("post-image-upload")?.click()
              }
            >
              {postImage ? (
                <img
                  src={postImage}
                  className="uploaded-image"
                  alt="Post Preview"
                />
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
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowCreatePost(false);
                  setPostCaption("");
                  setPostImage(null);
                }}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={() => {
                  console.log("Creating post:", postCaption, postImage);
                  setShowCreatePost(false);
                  setPostCaption("");
                  setPostImage(null);
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar (stays at the bottom) */}
      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
