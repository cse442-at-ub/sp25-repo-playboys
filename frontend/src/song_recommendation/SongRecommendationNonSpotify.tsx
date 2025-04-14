import React, { useEffect, useState, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";
import "./SongRecommendation.css";
import Sidebar from "../user_profile/Sidebar";

const mockSongs = [
  { song_name: "Levitating", artist_name: "Dua Lipa", cover_url: "https://link-to-cover1.jpg" },
  { song_name: "Blinding Lights", artist_name: "The Weeknd", cover_url: "https://link-to-cover2.jpg" },
  { song_name: "Peaches", artist_name: "Justin Bieber", cover_url: "https://link-to-cover3.jpg" }
];

const SongRecommendationNonSpotify: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const controls = useAnimation();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadSong();
  }, [currentSongIndex]);

  const loadSong = async () => {
    const song = mockSongs[currentSongIndex % mockSongs.length];
    setCurrentSong(song);
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/playSong.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_name: song.song_name, artist_name: song.artist_name }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setPreviewUrl(data.trackUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleLike = async () => {
    setSwipeDirection("left");
    setLiked(true);

    await fetch(`${process.env.REACT_APP_API_URL}backend/likeLocalSong.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(currentSong)
    });

    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.4 } });
    resetState();
    setCurrentSongIndex(prev => prev + 1);
  };

  const handleSkip = async () => {
    setSwipeDirection("right");
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.4 } });
    resetState();
    setCurrentSongIndex(prev => prev + 1);
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
                <audio ref={audioRef} src={previewUrl} controls autoPlay style={{ marginTop: "1rem" }} />
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
