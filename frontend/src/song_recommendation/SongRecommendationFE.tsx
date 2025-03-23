import React, { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";
import "./SongRecommendation.css";
import Sidebar from "../user_profile/Sidebar";

const SongRecommendation: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchNextSong = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}getDeezerRecommendation.php`, {
        credentials: 'include',
      });
  
      const data = await res.json();
      console.log("Fetched song:", data); // 👈 Add this
  
      if (data.error) {
        console.error("Backend error:", data.error); // 👈 Show backend issues
      } else {
        setSong(data);
      }
    } catch (err) {
      console.error("Failed to fetch song:", err);
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchNextSong();
  }, []);

  useEffect(() => {
    if (hasInteracted && song?.preview_url) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(song.preview_url);
  
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Audio failed:", e));
    }
  }, [song, hasInteracted]);
  

  const handleLike = async () => {
    setSwipeDirection("left");
    setLiked(true);
    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.4 } });
    await resetSong();
  };

  const handleSkipSong = async () => {
    setSwipeDirection("right");
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.4 } });
    await resetSong();
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Audio play error:", e));
    }
    setHasInteracted(true);
  };
  
  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };  

  const resetSong = async () => {
    setSwipeDirection(null);
    setLiked(false);
    await controls.start({ x: 0, opacity: 1 });
    fetchNextSong();
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleLike,
    onSwipedRight: handleSkipSong,
    trackTouch: true,
    trackMouse: true,
  });

  if (loading || !song) return <div>Loading song...</div>;

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

        <div className="album-art">
          <img src={song.image} alt="Album Art" style={{ width: "100%", height: "100%"}} />
        </div>
        <div className="song-info">
          <h2>{song.name}</h2>
          <h2>{song.artist}</h2>
          <h2>{song.album}</h2>
          <h2>Genre: {song.genre}</h2>
          <h2>Background:</h2>
          <h3>{song.backgroundStory}</h3>
        </div>
      </motion.div>

      <div className="controls">
        <button className={`heart-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
          <img src={liked ? "./static/HeartIconLike.png" : "./static/HeartIconUnlike.png"} alt="Like" />
        </button>
        {!isPlaying ? (
          <button onClick={handlePlay}>
            <img src="./public/static/PlayButtonIcon.png" alt="Play" />
          </button>
        ) : (
          <button onClick={handlePause}>
            <img src="./public/static/PauseButtonIcon.png" alt="Pause" />
          </button>
        )}
        <button className="skip-btn" onClick={handleSkipSong}>
          <img src="./static/SkipSong.png" alt="Skip" />
        </button>
      </div>

      <div className="side-column">
        <Sidebar />
      </div>
    </div>
  );
};

export default SongRecommendation;
