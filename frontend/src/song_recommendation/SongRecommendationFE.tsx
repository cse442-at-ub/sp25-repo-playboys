import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useGesture } from "@use-gesture/react"; // Correct import
import "./SongRecommendation.css";
import Sidebar from '../user_profile/Sidebar';

const SongRecommendation: React.FC = () => {
  const [liked, setLiked] = useState(false);
  const [song, setSong] = useState({
    name: "Song Name",
    artist: "Artist Name",
    album: "Album Name",
    genre: "Rock, Kpop",
    backgroundStory: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  });

  const handleAddToPlaylist = () => {
    console.log("Song added to playlist");
  };

  const handleSkipSong = () => {
    console.log("Skipped to next song");
  };

  return (
    <div className="song-container">
      <div className="song-details">
        <animated.div {...bind()} style={{ ...style, touchAction: "none" }}>
          <div className="album-art"></div>
          <div className="song-info">
            <h2>{song.name}</h2>
            <h2>{song.artist}</h2>
            <h2>{song.album}</h2>
            <h2>Genre: {song.genre}</h2>
            <h2>Background:</h2>
            <h3>{song.backgroundStory}</h3>
          </div>
        </animated.div>
      </div>
      <div className="controls">
        <button className={`heart-btn ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)}>
          <img src={liked ? "./static/HeartIconLike.png" : "./static/HeartIconUnlike.png"} alt="Like" />
        </button>
        <button className="add-btn" onClick={handleAddToPlaylist}>
          <img src="./static/Add2Playlist.png" alt="Add" />
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
