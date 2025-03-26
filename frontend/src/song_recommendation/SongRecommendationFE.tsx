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
  const [remainingTime, setRemainingTime] = useState<number>(MAX_PLAY_DURATION);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const fetchToken = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}backend/spotifyplayer.php`, {
      credentials: "include"
    });
    
    const data = await res.json();
    setToken(data.access_token);
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}backend/refresh_token.php`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.access_token) {
        setToken(data.access_token);
        return data.access_token;
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
    return null;
  };
  
  const safeFetch = async (url: string, options: RequestInit): Promise<Response> => {
    let res = await fetch(url, options);
    if (res.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const newOptions = {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${newToken}`
          }
        };
        res = await fetch(url, newOptions);
      }
    }
    return res;
  };  

  const getRandomTrackFromRandomPlaylist = async () => {
    if (!token) return null;
  
    const searchTerms = ["top", "hits", "vibes", "pop", "chill", "party"];
    const randomSearch = searchTerms[Math.floor(Math.random() * searchTerms.length)];
  
    const searchRes = await safeFetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(randomSearch)}&type=playlist&limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const searchData = await searchRes.json();
    const playlists = (searchData.playlists?.items || []).filter((p: any) => p && p.id);
  
    if (!playlists || playlists.length === 0) return null;
  
    const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
    const playlistId = randomPlaylist.id;
  
    const tracksRes = await safeFetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  
    const tracksData = await tracksRes.json();
    const tracks = tracksData.items
      .map((item: any) => item.track)
      .filter((track: any) => track?.uri);
  
    if (tracks.length === 0) return null;
  
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    return randomTrack;
  };
  

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Web Playback Player",
        getOAuthToken: (cb: (token: string) => void) => cb(token!),
        volume: 0.8,
      });
  
      playerRef.current = player;
  
      player.addListener("ready", async ({ device_id }: any) => {
        setDeviceId(device_id);
        setPlayerReady(true);
        await safeFetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ device_ids: [device_id], play: true }),
        });
  
        const randomTrack = await getRandomTrackFromRandomPlaylist();
        if (randomTrack) {
          await safeFetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: [randomTrack.uri],
              position_ms: 0,
            }),
          });
          setCurrentTrack(randomTrack);
        }
      });
  
      player.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        const track = state.track_window?.current_track;
        setCurrentTrack(track);
      });
  
      player.connect();
    };
  }, [token]);  

  useEffect(() => {
    if (isPlaying && currentTrack) {
      // Start countdown only if not already running
      if (!countdownIntervalRef.current) {
        setCountdown(Math.ceil(remainingTime / 1000));
  
        countdownIntervalRef.current = setInterval(() => {
          setRemainingTime(prev => {
            const next = prev - 1000;
            setCountdown(Math.ceil(next / 1000));
            return next;
          });
        }, 1000);
  
        timeoutRef.current = setTimeout(() => {
          fadeOutAndSkip();
          clearInterval(countdownIntervalRef.current!);
          countdownIntervalRef.current = null;
          timeoutRef.current = null;
          setCountdown(null);
          setRemainingTime(MAX_PLAY_DURATION); // Reset for next track
        }, remainingTime);
      }
    } else {
      // Pause countdown
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      countdownIntervalRef.current = null;
      timeoutRef.current = null;
    };
  }, [isPlaying, currentTrack]);  


  const handlePlay = async () => {
    if (!deviceId || !token) {
      console.warn("Device not ready yet");
      return;
    }
  
    await safeFetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
  

  const handlePause = () => {
    if (!deviceId || !token) return;
    safeFetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
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
  
    const randomTrack = await getRandomTrackFromRandomPlaylist();
    if (randomTrack) {
      await safeFetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uris: [randomTrack.uri],
          position_ms: 0,
        }),
      });
      setRemainingTime(MAX_PLAY_DURATION);
      setCurrentTrack(randomTrack);
    }
  
    await controls.start({ x: 0, opacity: 1 });
    setSwipeDirection(null);
    setLiked(false);
  };
  

  const fadeOutAndSkip = async () => {
    if (!playerRef.current || !token || !deviceId) return;
  
    let volume = 0.8;
    const fadeStep = 0.1;
    const interval = 100;
  
    const fade = setInterval(async () => {
      volume = Math.max(0, volume - fadeStep);
      await playerRef.current.setVolume(volume);
  
      if (volume <= 0) {
        clearInterval(fade);
  
        const randomTrack = await getRandomTrackFromRandomPlaylist();
        if (randomTrack) {
          await safeFetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uris: [randomTrack.uri],
              position_ms: 0,
            }),
          });
  
          setCurrentTrack(randomTrack);
        }
  
        // Restore volume for next track
        setTimeout(() => playerRef.current.setVolume(0.8), 500);
      }
    }, interval);
    setRemainingTime(MAX_PLAY_DURATION);
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
          <button onClick={handlePlay} disabled={!playerReady}>
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
