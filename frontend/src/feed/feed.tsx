import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from "../csrfContent"; // CSRF Protection Hook
import "./feed.css"; // Import the external CSS file

interface Post {
  post_id: number;
  username: string;
  title: string;
  description: string;
  song_name: string;
  media_path: string;
  media_type: "image" | "video";
  created_at: string;
  community: string;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}backend/getPosts.php`,
          {
            method: "GET",
            credentials: "include",
            headers: { "CSRF-Token": csrfToken },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          setPosts(result.posts);
        } else {
          setError(result.message || "Failed to load posts");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSwipe = (e: React.WheelEvent) => {
    if (isScrolling || isLoading || posts.length === 0) return;

    setIsScrolling(true);
    setTimeout(() => {
      if (e.deltaY > 0 && currentPost < posts.length - 1) {
        setCurrentPost(currentPost + 1);
      } else if (e.deltaY < 0 && currentPost > 0) {
        setCurrentPost(currentPost - 1);
      }
      setIsScrolling(false);
    }, 300);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (posts[currentPost]?.media_type === "video") {
        videoRef.current.load();
      }
    }
  }, [currentPost, posts]);

  if (isLoading) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-feed">
        <p>No posts available</p>
        <button onClick={() => navigate("/feed/post")}>Create First Post</button>
      </div>
    );
  }

  const current = posts[currentPost];

  return (
    <div className="feed-container" onWheel={handleSwipe}>
      <div className="post-content">
        {current.media_type === "video" ? (
          <video
            ref={videoRef}
            className="post-media"
            src={current.media_path}
            autoPlay
            loop
            muted
            playsInline
            key={current.post_id}
          />
        ) : (
          <img
            src={current.media_path}
            alt={current.title}
            className="post-media"
            key={current.post_id}
          />
        )}
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        {/* Post Info (Bottom Left) */}
        <div className="post-info">
          <h2>{current.title}</h2>
          <p>{current.description}</p>
          <p className="song-name">🎵 {current.song_name}</p>
          <p className="username">@{current.username}</p>
          <p>{current.community}</p>
        </div>

        {/* Post Button (Bottom Right) */}
        <button className="post-button" onClick={() => navigate("/feed/post")}>
          Create Post
        </button>
      </div>
    </div>
  );
};

export default Feed;
