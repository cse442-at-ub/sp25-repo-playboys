import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";
import MainContent from "../MainContent";
import { useCSRFToken } from '../csrfContent';

interface Community {
  community_name: string;
  picture: string;
  members: string[];
  id: number;
  member_count: number;
  posts: Post[];
}

interface Post {
  username: string;
  title: string;
  song_name: string;
  post_id: number;
  media_path: string;
  description: string;
}

const CommunityPage: React.FC = () => {
  const location = useLocation();
  const { csrfToken } = useCSRFToken();
  const [communityData, setCommunityData] = useState<Community>();
  const [joined, setJoined] = useState<boolean>(false);

  const getCommunityName = () => {
    const path = location.pathname;
    const segments = path.split("/");
    const encodedName = segments[segments.length - 1];
    return decodeURIComponent(encodedName);
  };

  const getCommunityData = async (communityName: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getCommInfo.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ name: communityName }),
    });

    const data = await res.json();
    return data;
  };

  const createPosts = (posts: Post[]) => {
    return posts.map((post) => ({
      ...post,
      media_path: `${process.env.REACT_APP_API_URL}${post.media_path.startsWith("/") ? "" : "/"}${post.media_path}`,
    }));
  };

  useEffect(() => {
    const communityName = getCommunityName();
    const fetchData = async () => {
      const data = await getCommunityData(communityName);
      const posts = createPosts(data.posts);
      setCommunityData({
        community_name: data.community_name,
        picture: data.picture,
        members: data.members,
        id: data.id,
        member_count: data.members.length,
        posts: posts,
      });
    };
    fetchData();
  }, [location]);

  useEffect(() => {
    if (communityData) {
      updateUserStatus();
    }
  }, [communityData]);

  const verifyUserSession = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getProfile.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
    });
    const data = await res.json();
    return data.loggedInUser;
  };

  const getUserCommunities = async (username: string) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getcomms.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({ user: username }),
    });
    return await res.json();
  };

  const updateUserStatus = async () => {
    const profile = await verifyUserSession();
    const communities = await getUserCommunities(profile);
    setJoined(communities.includes(communityData?.community_name));
  };

  const toggleMembership = async () => {
    const user = await verifyUserSession();
    const route = joined ? "leave_community.php" : "join_community.php";
    const profileRoute = joined ? "removecomtopfp.php" : "addcomtopfp.php";

    await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: communityData?.community_name,
        image: communityData?.picture,
        user,
      }),
    });

    await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/${profileRoute}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken,
      },
      body: JSON.stringify({
        name: communityData?.community_name,
        image: communityData?.picture,
        user,
      }),
    });

    updateUserStatus();
  };

  return (
    <MainContent>
      <div className="community-page">
        {/* Header */}
        <div className="community-header">
          <img
            className="background-image"
            src={communityData?.picture || process.env.PUBLIC_URL + "/static/placeholder.jpg"}
            alt="Community Background"
          />
          <h1 className="community-name">{communityData?.community_name}</h1>
          <button
            className={`join-btn ${joined ? "leave" : ""}`}
            onClick={toggleMembership}
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>

        {/* Member Info */}
        <div className="community-details">
          <p><strong>Member count:</strong> {communityData?.member_count}</p>
          <p><strong>Members:</strong> {communityData?.members.join(", ")}</p>
        </div>

        {/* Posts */}
        {communityData?.posts?.map((post) => (
          <div className="post" key={post.post_id}>
            <div className="post-header">
              <img
                src={process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"}
                alt="Profile"
                className="profile-pic"
              />
              <span className="username">{post.username}</span>
            </div>
            <div className="caption">{post.title}</div>
            {post.media_path && (
              <img src={post.media_path} alt="Post" className="post-image" />
            )}
            <div className="controls">
              <button className="heart-btn">
                <img
                  src={process.env.PUBLIC_URL + "/static/HeartIconUnlike.png"}
                  alt="Like"
                />
              </button>
              <button className="comment-btn">
                <img
                  src={process.env.PUBLIC_URL + "/static/CommentIcon.png"}
                  alt="Comment"
                />
              </button>
            </div>
            <div className="comments-section">
              <div className="comment">
                <img
                  src={process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"}
                  alt="Commenter"
                  className="comment-profile-pic"
                />
                <div className="comment-content">
                  <span className="comment-username">User1</span>
                  <p className="comment-text">This is a short comment, up to 100 characters max!</p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Add Button */}
        <button className="floating-add-btn">+</button>

        {/* Sidebar */}
        <div className="side-column">
          <Sidebar />
        </div>
      </div>
    </MainContent>
  );
};

export default CommunityPage;
