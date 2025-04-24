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
  like_count: number;
  comment_count: number;
  created_at: string;
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
  const [filter, setFilter] = useState("most_recent");
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  


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
      const counts: { [key: number]: number } = {};
      posts.forEach((post) => {
        counts[post.post_id] = post.like_count;
      });
      setLikeCounts(counts);

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
  
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
      credentials: "include",
      body: JSON.stringify({ post_id: postId, username: currentUser }),
    });
  
    if (res.ok) {
      setLikedPosts((prev) => ({ ...prev, [postId]: !liked }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: liked ? prev[postId] - 1 : prev[postId] + 1,
      }));
    }
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
  
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/addComment.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "CSRF-Token": csrfToken },
      credentials: "include",
      body: JSON.stringify({ post_id: postId, username: currentUser, comment: text }),
    });
  
    if (res.ok) {
      // Update state
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { username: currentUser, comment_text: text }]
      }));
      setTotalComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));
    }
  };
  

  const filterPosts = (posts: Post[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    const lastWeek = new Date(today);
    const lastMonth = new Date(today);
  
    yesterday.setDate(today.getDate() - 1);
    lastWeek.setDate(today.getDate() - 7);
    lastMonth.setMonth(today.getMonth() - 1);
  
    return posts.slice().filter((post) => {
      const postDate = new Date(post.created_at);
  
      if (filter === "today") return postDate.toDateString() === today.toDateString();
      if (filter === "yesterday") return postDate.toDateString() === yesterday.toDateString();
      if (filter === "last_week") return postDate >= lastWeek;
      if (filter === "last_month") return postDate >= lastMonth;
  
      return true; // show all if no time filter
    }).sort((a, b) => {
      if (filter === "most_liked") return (likeCounts[b.post_id] || 0) - (likeCounts[a.post_id] || 0);
      if (filter === "most_commented") return b.comment_count - a.comment_count;
      if (filter === "most_recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0; // keep original order
    });
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
        </div>
        <div className="post-filter">
          <label htmlFor="postFilter">Sort Posts By:</label>
          <select
            id="postFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="most_recent">Most Recent</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_commented">Most Commented</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>

        {filterPosts(communityData?.posts || []).map((post) => (
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
              <div className="like-wrapper">
                <button className="like-btn" onClick={() => handleLike(post.post_id)}>
                  <img
                    src={
                      likedPosts[post.post_id]
                        ? process.env.PUBLIC_URL + "/static/HeartIconLike.png"
                        : process.env.PUBLIC_URL + "/static/HeartIconUnlike.png"
                    }
                    alt="Like"
                  />
                </button>
                <span className="like-count">{likeCounts[post.post_id] || 0}</span>
              </div>

              <div className="comment-wrapper">
                <button className="comment-btn" onClick={() => {
                  fetchComments(post.post_id);
                  setCommentsVisible(prev => ({ ...prev, [post.post_id]: !prev[post.post_id] }));
                }}>
                  <img src={process.env.PUBLIC_URL + "/static/CommentIcon.png"} alt="Comment" />
                </button>
                <span className="comment-count">{totalComments[post.post_id] || 0}</span>
              </div>
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