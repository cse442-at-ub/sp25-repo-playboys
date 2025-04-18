import React, { useState, useRef, useEffect } from 'react';
import './SpotifyPlayer.css';

interface SpotifyPlayerProps {
  trackUrl: string;
  title: string;
  artist: string;
  onClose: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${minutes}:${secs}`;
};

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ trackUrl, title, artist, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Drag/resize state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // Mouse handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
      }
    };
    const onMouseUp = () => (isDragging.current = false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const bar = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bar.left;
    const newTime = (clickX / bar.width) * duration;
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  const handleLike = () => {
    const formattedArtist = artist.charAt(0).toUpperCase() + artist.slice(1);
    const args = { title, artist: formattedArtist };
    const queryString = new URLSearchParams(args).toString();
    fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/addToLikePlaylist.php?${queryString}`)
      .then(res => res.text())
      .then(() => alert('Song added to Liked Songs Playlist'))
      .catch(err => console.error('Error liking song:', err));
  };

  return (
    <div
      className="spotify-player-wrapper"
      style={{ left: position.x, top: position.y }}
      ref={dragRef}
    >
      {/* Drag handle + utility buttons */}
      <div className="player-header" onMouseDown={handleMouseDown}>
        <div className="header-title"></div>
        <div className="header-buttons">
          <button className="icon-btn" onClick={handleLike}>❤️</button>
          <button className="icon-btn" onClick={onClose}>❌</button>
        </div>
      </div>
      {/* Track info */}
      <div className="track-info">
        <h1 className="song-title">{title}</h1>
        <h2 className="song-artist">{artist}</h2>
      </div>
      {/* Progress bar */}
      <div className="progress-container">
        <span className="time-label">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={seek}>
          <div
            className="progress-filled"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <span className="time-label">{formatTime(duration)}</span>
      </div>
      {/* Playback controls */}
      <div className="controls">
        <button className="icon-btn shuffle">🔀</button>
        <button className="icon-btn prev">⏮️</button>
        <button className="icon-btn play" onClick={togglePlay}> {isPlaying ? '⏸️' : '▶️'} </button>
        <button className="icon-btn next">⏭️</button>
        <button className="icon-btn repeat">🔁</button>
      </div>
      <audio ref={audioRef} src={trackUrl} />
    </div>
  );
};

export default SpotifyPlayer;