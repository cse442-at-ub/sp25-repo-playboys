import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./feed.css";

const Feed = () => {
    const posts = [
        { "title": "Post 1", "description": "Exploring the city", "media": "https://www.w3schools.com/html/mov_bbb.mp4", "song": "Urban Vibes" },
        { "title": "Post 2", "description": "Chill vibes at the beach", "media": "https://www.w3schools.com/html/movie.mp4", "song": "Ocean Waves" },
        { "title": "Post 3", "description": "Late night coding session", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", "song": "Lo-Fi Beats" },
        { "title": "Post 4", "description": "Skating through the streets", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "song": "Hip-Hop Flow" },
        { "title": "Post 5", "description": "Nature getaway", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "song": "Peaceful Melody" },
        { "title": "Post 6", "description": "Night drive with neon lights", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", "song": "Synthwave Dream" },
        { "title": "Post 7", "description": "Morning workout grind", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4", "song": "Pump Up Anthem" },
        { "title": "Post 8", "description": "Cozy rainy day", "media": "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", "song": "Relaxing Rain Sounds" },
    ];

    const [currentPost, setCurrentPost] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const navigate = useNavigate();

    // Prevent rapid scrolling by adding a small delay
    const handleSwipe = (e: React.WheelEvent) => {
        if (isScrolling) return; // Block further scrolling if already in transition
        setIsScrolling(true);

        // Delay to allow for smooth scrolling experience
        setTimeout(() => {
            if (e.deltaY > 0 && currentPost < posts.length - 1) {
                setCurrentPost(currentPost + 1);
            } else if (e.deltaY < 0 && currentPost > 0) {
                setCurrentPost(currentPost - 1);
            }
            setIsScrolling(false); // Allow scrolling again after delay
        }, 300); // Delay of 300ms for smooth transition
    };

    // Add smooth transitions to video post and content
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0; // Restart video when switching posts
        }
    }, [currentPost]);

    return (
        <div className="feed-container" onWheel={handleSwipe}>
            <div className="post">
                <video
                    ref={videoRef}
                    className="post-video"
                    src={posts[currentPost].media}
                    autoPlay
                    loop
                    muted
                    key={currentPost} // Ensure the video restarts on post change
                ></video>
                <div className="post-overlay">
                    <div className="post-info">
                        <h2>{posts[currentPost].title}</h2>
                        <p>{posts[currentPost].description}</p>
                        <p className="song">🎵 {posts[currentPost].song}</p>
                    </div>
                </div>
            </div>
            <div className="post-actions">
                    <button onClick={() => navigate("/feed/post")}>Post</button>
            </div>
        </div>
    );
};

export default Feed;
