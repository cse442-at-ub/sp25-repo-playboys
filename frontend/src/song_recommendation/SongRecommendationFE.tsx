import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";
import "./SongRecommendation.css";
import Sidebar from "../user_profile/Sidebar";

const SongRecommendation: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const controls = useAnimation();

  const [song, setSong] = useState({
    name: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    genre: "Rock, Kpop",
    backgroundStory: "dolce far niente"
  });

  // Handles Like (Swipe Left)
  const handleLike = async () => {
    setSwipeDirection("left");
    setLiked(true);
    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.4 } });
    resetSong();
  };

  // Handles Skip (Swipe Right)
  const handleSkipSong = async () => {
    setSwipeDirection("right");
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.4 } });
    resetSong();
  };

  // Reset song + swipe direction
  const resetSong = async () => {
    setSwipeDirection(null);
    setLiked(false);
    setSong({
      name: "New Song",
      artist: "New Artist",
      album: "New Album",
      genre: "Pop, Jazz",
      backgroundStory: "New background story"
    });
    await controls.start({ x: 0, opacity: 1 }); // Reset animation
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleLike,
    onSwipedRight: handleSkipSong,
    //preventDefaultTouchmoveEvent: true,
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
        {/* Swipe Indicator */}
        {swipeDirection && (
          <div className={`swipe-indicator ${swipeDirection}`}>
            {swipeDirection === "left" ? "❤️ Liked" : "⏭️ Skipped"}
          </div>
        )}

        <div className="album-art"></div>
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
