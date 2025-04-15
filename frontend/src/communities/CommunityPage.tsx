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
  media_type: 'image' | 'video';
}

const CommunityPage: React.FC = () => {
  const location = useLocation();
  const { csrfToken } = useCSRFToken();
  const [communityData, setCommunityData] = useState<Community>();
  const [joined, setJoined] = useState<boolean>(false);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [song, setSong] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getCommunityName = () => {
    const path = location.pathname;
    const segments = path.split("/");
    return decodeURIComponent(segments[segments.length - 1]);
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
    return await res.json();
  };

  const createPosts = (posts: Post[]) => {
    return posts.map((post) => ({
      ...post,
      media_path: post.media_path.startsWith("http")
        ? post.media_path
        : `${process.env.REACT_APP_API_URL}${post.media_path.startsWith("/") ? "" : "/"}${post.media_path}`,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const communityName = getCommunityName();
      const data = await getCommunityData(communityName);
      const posts = createPosts(data.posts);
      setCommunityData({
        community_name: data.community_name,
        picture: data.picture,
        members: data.members,
        id: data.id,
        member_count: data.members.length,
        posts,
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

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let uploadedImagePath = "";
      let mediaType = "";

      if (media) {
        const fileExt = media.name.split('.').pop()?.toLowerCase();
        mediaType = (fileExt === "mp4" || fileExt === "webm") ? "video" : "image";

        const imageData = new FormData();
        imageData.append("image", media);

        const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}backend/ReusableUploadMedia.php`, {
          method: "POST",
          body: imageData,
          credentials: "include",
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.status === "success") {
          uploadedImagePath = uploadResult.filePath;
        } else {
          setError(uploadResult.message || "Upload failed.");
          setIsSubmitting(false);
          return;
        }
      }

      const postPayload = {
        title,
        description,
        song,
        community: communityData?.community_name || "",
        media_path: uploadedImagePath,
        media_type: mediaType,
      };

      const postResponse = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/createCommunityPost.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(postPayload),
      });

      if (postResponse.ok) {
        const postResult = await postResponse.json();
        if (postResult.status === "success") {
          setShowCreatePostModal(false);
          window.location.reload();
        } else {
          setError(postResult.message);
        }
      } else {
        const raw = await postResponse.text();
        console.error("Raw response:", raw);
        setError("An unexpected error occurred on the server.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainContent>
      <div className="community-page">
        <div className="community-header">
          <img className="background-image" src={communityData?.picture || process.env.PUBLIC_URL + "/static/placeholder.jpg"} alt="Community Background" />
          <h1 className="community-name">{communityData?.community_name}</h1>
          <button className={`join-btn ${joined ? "leave" : ""}`} onClick={toggleMembership}>
            {joined ? "Joined" : "Join"}
          </button>
        </div>

        <div className="community-details">
          <p><strong>Member count:</strong> {communityData?.member_count}</p>
          <p><strong>Members:</strong> {communityData?.members.join(", ")}</p>
        </div>

        {communityData?.posts?.map((post) => (
          <div className="post" key={post.post_id}>
            <div className="post-header">
              <img src={process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"} alt="Profile" className="profile-pic" />
              <span className="username">{post.username}</span>
            </div>
            <div className="caption">{post.title}</div>
            {post.media_type === "video" ? (
              <video src={post.media_path} className="post-image" controls />
            ) : (
              <img src={post.media_path} alt="Post" className="post-image" />
            )}
            <div className="controls">
              <button className="heart-btn">
                <img src={process.env.PUBLIC_URL + "/static/HeartIconUnlike.png"} alt="Like" />
              </button>
              <button className="comment-btn">
                <img src={process.env.PUBLIC_URL + "/static/CommentIcon.png"} alt="Comment" />
              </button>
            </div>
          </div>
        ))}

        <div className="side-column">
          <Sidebar />
          <button className="sidebar-add-btn" onClick={() => setShowCreatePostModal(true)}>+</button>
        </div>
      </div>

      {showCreatePostModal && (
        <div className="create-post-modal">
          <div className="create-post-box">
            <h2>Create a New Post</h2>
            <form onSubmit={handlePostSubmit}>
              <input type="text" placeholder="Post Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <input type="text" placeholder="Song Name" value={song} onChange={(e) => setSong(e.target.value)} required />
              <input type="file" accept="image/*,video/*" onChange={(e) => setMedia(e.target.files?.[0] || null)} />
              <div className="create-post-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowCreatePostModal(false)}>Cancel</button>
                <button type="submit" className="create-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </MainContent>
  );
};

export default CommunityPage;