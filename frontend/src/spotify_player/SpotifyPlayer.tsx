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
  const [volume, setVolume] = useState(1);

  // Drag/resize state
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 600, height: 200 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const isResizing = useRef(false);
  const resizeStart = useRef({ x: 0, y: 0, width: 600, height: 200 });

  // Mouse handlers for dragging from move handle
  const handleMoveMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isDragging.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    isResizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
      } else if (isResizing.current) {
        const newWidth = resizeStart.current.width + (e.clientX - resizeStart.current.x);
        const newHeight = resizeStart.current.height + (e.clientY - resizeStart.current.y);
        setSize({ width: Math.max(newWidth, 100), height: Math.max(newHeight, 100) });
      }
    };
    const onMouseUp = () => {
      isDragging.current = false;
      isResizing.current = false;
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [position, size]);

  // Sync volume whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

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
    fetch(
      `https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/addToLikePlaylist.php?${queryString}`
    )
      .then((res) => res.text())
      .then(() => alert('Song added to Liked Songs Playlist'))
      .catch((err) => console.error('Error liking song:', err));
  };

  return (
    <div
      className="spotify-player-wrapper"
      style={{ left: position.x, top: position.y, width: size.width, height: size.height }}
      ref={dragRef}
    >
      <div className="player-header">
        <div className="header-title">
          <button
            className="icon-btn move-btn"
            title="Move"
            onMouseDown={handleMoveMouseDown}
          >
            ☰
          </button>
        </div>
        <div className="header-buttons">
          <button className="icon-btn" onClick={handleLike}>❤️</button>
          <button className="icon-btn" onClick={onClose}>❌</button>
        </div>
      </div>

      <div className="track-info">
        <h1 className="song-title">{title}</h1>
        <h2 className="song-artist">{artist}</h2>
      </div>

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

      <div className="controls">
        <button className="icon-btn play" onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
        />
      </div>

      {/* Resize handle */}
      <div
        data-resize-handle
        style={{
          width: 16,
          height: 16,
          position: 'absolute',
          right: 8,
          bottom: 8,
          cursor: 'se-resize',
          zIndex: 10,
        }}
        onMouseDown={handleResizeMouseDown}
      />

      <audio ref={audioRef} src={trackUrl} />
    </div>
  );
};

export default SpotifyPlayer;