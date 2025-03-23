import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { motion, useAnimation } from "framer-motion";
import "./SongRecommendation.css";
import Sidebar from "../user_profile/Sidebar";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

const SongRecommendation: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const MAX_PLAY_DURATION = 36000; // 36 seconds
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const controls = useAnimation();
  const playerRef = useRef<any>(null);

  const fetchToken = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}spotifyplayer.php`, {
      credentials: "include"
    });
    
    const data = await res.json();
    setToken(data.access_token);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (!token || playerReady) return;
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback Player",
        getOAuthToken: (cb: (token: string) => void) => cb(token),
        volume: 0.8,
      });
      playerRef.current = player;
      player.addListener("ready", ({ device_id }: any) => {
        console.log("Player ready with device_id:", device_id);
        setDeviceId(device_id);
        setPlayerReady(true);

        // Transfer playback to the device
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [device_id], play: true }),
        });

        // Start Top 50 Global playlist
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context_uri: "spotify:playlist:37i9dQZEVXbMDoHDwVN2tF",
          }),
        });
      });

      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        const track = state.track_window?.current_track;
        setCurrentTrack(track);
      });

      player.connect();
    };

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }, [token, playerReady]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;
  
    if (isPlaying && currentTrack) {
      const totalSeconds = MAX_PLAY_DURATION / 1000;
      setCountdown(totalSeconds); // Start countdown display
  
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev && prev > 1) return prev - 1;
          return null;
        });
      }, 1000);
  
      timeout = setTimeout(() => {
        fadeOutAndSkip();
        setCountdown(null); // Clear countdown when done
      }, MAX_PLAY_DURATION);
    }
  
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      setCountdown(null); // Clean up on song change
    };
  }, [isPlaying, currentTrack]);


  const handlePlay = async () => {
    if (!deviceId || !token) return;
  
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };  
  

  const handlePause = () => {
    if (!deviceId || !token) return;
    fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };  

  const handleLike = async () => {
    setSwipeDirection("left");
    setLiked(true);
    await controls.start({ x: -300, opacity: 0, transition: { duration: 0.4 } });
    await resetState();
  };

  const handleSkipSong = async () => {
    setSwipeDirection("right");
    await controls.start({ x: 300, opacity: 0, transition: { duration: 0.4 } });
    await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await resetState();
  };

  const fadeOutAndSkip = async () => {
    if (!playerRef.current || !token || !deviceId) return;
  
    let volume = 0.8; // starting volume
    const fadeStep = 0.1;
    const interval = 100; // ms between each step
  
    const fade = setInterval(async () => {
      volume = Math.max(0, volume - fadeStep);
      await playerRef.current.setVolume(volume);
  
      if (volume <= 0) {
        clearInterval(fade);
  
        // Skip track after fade
        await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Restore volume for next track
        setTimeout(() => playerRef.current.setVolume(0.8), 500);
      }
    }, interval);
  };

  const resetState = async () => {
    setSwipeDirection(null);
    setLiked(false);
    await controls.start({ x: 0, opacity: 1 });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleLike,
    onSwipedRight: handleSkipSong,
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

        {/*<div className="album-art">
          <img src="./static/PlaceholderCover.png" alt="Album Art" style={{ width: "100%", height: "100%" }} />
        </div>
        */}
        <div className="song-info">
        {currentTrack ? (
        <>
          <img
            src={currentTrack.album.images[0]?.url}
            alt="Album Art"
            style={{ width: "200px", borderRadius: "10px", marginBottom: "1rem" }}
          />
          <h2>{currentTrack.name}</h2>
          <h2>{currentTrack.artists.map((a: any) => a.name).join(", ")}</h2>
          <h2>{currentTrack.album.name}</h2>
          <h2>Now Playing: Top 50 Global Playlist</h2>
          {countdown !== null && (
          <h3 style={{ marginTop: "1rem", color: "#888" }}>
            Skipping in {countdown} second{countdown !== 1 ? "s" : ""}
          </h3>
          )}
        </>
      ) : (<> </>)}
        </div>
      </motion.div>

      <div className="controls">
        <button className={`heart-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
          <img src={liked ? "./static/HeartIconLike.png" : "./static/HeartIconUnlike.png"} alt="Like" />
        </button>

        {!isPlaying ? (
          <button onClick={handlePlay}>
            <img src="./static/PlayButtonIcon.png" alt="Play" />
          </button>
        ) : (
          <button onClick={handlePause}>
            <img src="./static/PauseButtonIcon.png" alt="Pause" />
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
