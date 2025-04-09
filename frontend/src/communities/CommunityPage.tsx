import React, {useState } from "react";
import { useNavigate } from "react-router-dom";
import './CommunityPage.css';
import Sidebar from "../user_profile/Sidebar";


const CommunityPage: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();


  const community = {
    name: 'Rock Lover',
    backgroundImage: '', // Leave empty to trigger placeholder
  };
  const placeholderBg = process.env.PUBLIC_URL + '/static/PlayBoysBackgroundImage169.jpeg'
  const backgroundImg = community.backgroundImage || placeholderBg;

  const post = {
    username: 'Username',
    profilePic: process.env.PUBLIC_URL+ "/static/ProfilePlaceholder.png",
    caption: 'This is the caption text for the post. It has a max of 250 characters.',
    postImage: '', // Empty means no image
  };
  return (
    <div className="community-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        ←
      </button>
      <div className="community-header">
      <img
          className="background-image"
          src={backgroundImg}
          alt="Community Background"
        />
        <h1 className="community-name">{community.name}</h1>
      </div>

      <div className="post">
        <div className="post-header">
        <img src={post.profilePic} alt="Profile" className="profile-pic" />
          <span className="username">{post.username}</span>
        </div>

        <div className="caption">{post.caption}</div>

        {post.postImage && (
          <img className="post-image" src={post.postImage} alt="Post" />
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
            <img src={process.env.PUBLIC_URL + "/static/CommentIcon.png"} alt="Comment" />
          </button>
        </div>


        <div className="comments-section">
          <div className="comment">
            <img src={process.env.PUBLIC_URL+ "/static/ProfilePlaceholder.png"} alt="Commenter" className="comment-profile-pic" />
            <div className="comment-content">
              <span className="comment-username">User1</span>
              <p className="comment-text">This is a short comment, up to 100 characters max!</p>
            </div>
          </div>

          <div className="comment">
            <img src={process.env.PUBLIC_URL+ "/static/ProfilePlaceholder.png"} alt="Commenter" className="comment-profile-pic" />
            <div className="comment-content">
              <span className="comment-username">User2</span>
              <p className="comment-text">Here's another example of a comment someone might write.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default CommunityPage;
