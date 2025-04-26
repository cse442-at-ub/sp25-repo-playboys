import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";
import "./SongRecommendation.css";
import Sidebar from "../user_profile/Sidebar";

const SongRecommendationNonSpotify: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const controls = useAnimation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSong();
  }, []);

  const loadSong = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getDeezerRecommendation.php`, {
      method: "GET",
      credentials: "include"
    });
    const data = await res.json();

    if (data.status === "success") {
      setCurrentSong(data.song);
      setPreviewUrl(data.trackUrl);
      setIsPlaying(true); // Reset play status for new song
    } else {
      setPreviewUrl(null);
    }
  };

  const handleLike = async () => {
    setSwipeDirection("left");
    setLiked(true);
  
    await fetch(`${process.env.REACT_APP_API_URL}backend/addToPlaylist.php`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        playlist: "Liked Songs",
        song_title: currentSong.song_name,
        artist_name: currentSong.artist_name
      })
    });    
  
    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.4 } });
    await resetState();
    loadSong();
  };
  

  const handleSkip = async () => {
    setSwipeDirection("right");
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.4 } });
    await resetState();
    loadSong();
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetState = async () => {
    setSwipeDirection(null);
    setLiked(false);
    await controls.start({ x: 0, opacity: 1 });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleLike,
    onSwipedRight: handleSkip,
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <div className="song-container">
      <motion.div
        className="song-details"
        {...swipeHandlers}
        animate={controls}
        initial={{ x: 0, opacity: 1 }}
      >
        {swipeDirection && (
          <div className={`swipe-indicator ${swipeDirection}`}>
            {swipeDirection === "left" ? "❤️ Liked" : "⏭️ Skipped"}
          </div>
        )}

        <div className="song-info">
          {currentSong && (
            <>
              <img
                src={currentSong.cover_url || "./static/PlaceholderCover.png"}
                alt="Album Art"
                style={{ width: "200px", borderRadius: "10px", marginBottom: "1rem" }}
              />
              <h2>{currentSong.song_name}</h2>
              <h2>{currentSong.artist_name}</h2>
              {previewUrl ? (
                <audio
                  ref={audioRef}
                  src={previewUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  style={{ display: "none" }}
                />
              ) : (
                <p style={{ color: "gray" }}>No preview available</p>
              )}
            </>
          )}
        </div>
      </motion.div>

      <div className="controls">
        <button className={`heart-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
          <img src={liked ? "./static/HeartIconLike.png" : "./static/HeartIconUnlike.png"} alt="Like" />
        </button>

        {isPlaying ? (
          <button onClick={handlePause}>
            <img src="./static/PauseButtonIcon.png" alt="Pause" />
          </button>
        ) : (
          <button onClick={handlePlay}>
            <img src="./static/PlayButtonIcon.png" alt="Play" />
          </button>
        )}

        <button className="skip-btn" onClick={handleSkip}>
          <img src="./static/SkipSong.png" alt="Skip" />
        </button>
      </div>

      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default SongRecommendationNonSpotify;
