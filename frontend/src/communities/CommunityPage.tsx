import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./CommunityPage.css";
import Sidebar from "../user_profile/Sidebar";
import MainContent from "../MainContent";
import { useCSRFToken } from '../csrfContent';
import { useSidebar } from "../SidebarContext";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  const { isOpen } = useSidebar();
  const [communityData, setCommunityData] = useState<Community>();
  const [joined, setJoined] = useState<boolean>(false);

  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [song, setSong] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState<string>("");
  const [commentsVisible, setCommentsVisible] = useState<{ [key: number]: boolean }>({});
  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});
  const [newComments, setNewComments] = useState<{ [key: number]: string }>({});
  const [comments, setComments] = useState<{ [key: number]: any[] }>({});
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({});
  const [totalComments, setTotalComments] = useState<{ [key: number]: number }>({});


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
      const user = await verifyUserSession();
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

      posts.forEach((post) => {
        fetchComments(post.post_id, 3);
      });

      const fetchLikedPosts = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getLikedPosts.php?username=${user}`);
        const data = await res.json();
        const map: { [key: number]: boolean } = {};
        data.liked.forEach((postId: number) => {
          map[postId] = true;
        });
        setLikedPosts(map);
      };
  
      await fetchLikedPosts();

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
    setCurrentUser(data.loggedInUser);
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

  const fetchComments = async (postId: number, limit: number = 3) => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getComments.php?post_id=${postId}&limit=${limit}`);
    const data = await res.json();
    setComments((prev) => ({ ...prev, [postId]: data.comments }));
    setTotalComments((prev) => ({ ...prev, [postId]: data.total }));
  };

  const handleLike = async (postId: number) => {
    const liked = likedPosts[postId];
  
    const endpoint = liked ? "unlikePost.php" : "likePost.php";
  
    await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
      credentials: "include",
      body: JSON.stringify({ post_id: postId, username: currentUser }),
    });
  
    setLikedPosts((prev) => ({ ...prev, [postId]: !liked }));
  };
  
  const toggleComments = (postId: number) => {
    const isExpanded = expanded[postId];
    const newLimit = isExpanded ? 3 : 10;
    fetchComments(postId, newLimit);
    setExpanded((prev) => ({ ...prev, [postId]: !isExpanded }));
  };

  const handleCommentSubmit = async (postId: number) => {
    const text = newComments[postId];
    if (!text) return;
    await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/addComment.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
      credentials: "include",
      body: JSON.stringify({ post_id: postId, username: currentUser, comment: text }),
    });
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
    fetchComments(postId, expanded[postId] ? 10 : 3);
  };


  return (
    <MainContent>
      <div className="community-page">
        <div className="community-header">
          <button
            onClick={() => navigate(-1)}
            className="community-back-btn"
          >
            ←
          </button>

          <img className="background-image" src={communityData?.picture || process.env.PUBLIC_URL + "/static/placeholder.jpg"} alt="Community Background" />
          <h1 className="community-name">{communityData?.community_name}</h1>
          <button className={`join-btn ${joined ? "leave" : ""}`} onClick={toggleMembership}>
            {joined ? "Joined" : "Join"}
          </button>
        </div>

        <div className="community-details">
          <p><strong>Member count:</strong> {communityData?.member_count}</p>
          {/*<p><strong>Members:</strong> {communityData?.members.join(", ")}</p>*/}
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
              <button className="heart-btn" onClick={() => handleLike(post.post_id)}>
              <img
                src={
                  likedPosts[post.post_id]
                    ? process.env.PUBLIC_URL + "/static/HeartIconLike.png"
                    : process.env.PUBLIC_URL + "/static/HeartIconUnlike.png"
                }
                alt="Like"
              />

              </button>
              <button className="comment-btn" onClick={() => {
                fetchComments(post.post_id);
                setCommentsVisible(prev => ({ ...prev, [post.post_id]: !prev[post.post_id] }));
              }}>
                <img src={process.env.PUBLIC_URL + "/static/CommentIcon.png"} alt="Comment" />
              </button>
            </div>
            
            <div className="comments-section">
            {comments[post.post_id]?.map((comment, index) => (
              <div className="comment" key={index}>
                <img src={process.env.PUBLIC_URL + "/static/ProfilePlaceholder.png"} className="comment-profile-pic" />
                <div className="comment-content">
                  <span className="comment-username">{comment.username}</span>
                  <p className="comment-text">{comment.comment_text}</p>
                </div>
              </div>
            ))}

            {/* Show More / Show Less */}
            {totalComments[post.post_id] > 3 && (
              <div className="show-more-wrapper">
                <button onClick={() => toggleComments(post.post_id)}>
                  {expanded[post.post_id] ? "Show Less" : "Show More"}
                </button>
              </div>
            )}


            {/* Add comment form (only if visible) */}
            {commentsVisible[post.post_id] && (
              <>
                <input
                  value={newComments[post.post_id] || ""}
                  onChange={(e) =>
                    setNewComments((prev) => ({ ...prev, [post.post_id]: e.target.value }))
                  }
                  placeholder="Add a comment..."
                />
                <button onClick={() => handleCommentSubmit(post.post_id)}>Post</button>
              </>
            )}
          </div>


          </div>
        ))}

        <div className="side-column">
          <Sidebar />
        </div>

        {joined && (
          <button
            className={`sidebar-add-btn ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
            onClick={() => setShowCreatePostModal(true)}
          >
            +
          </button>
        )}

      </div>

      {joined && showCreatePostModal && (
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