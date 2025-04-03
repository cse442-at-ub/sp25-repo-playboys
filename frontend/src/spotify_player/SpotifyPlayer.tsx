import React, { useState, useRef } from 'react';
import './SpotifyPlayer.css';

interface SpotifyPlayerProps {
  trackUrl: string;
  title: string;
  artist: string;
  onClose: () => void;
}

const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ trackUrl, title, artist, onClose }) => {
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(150);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const increaseSize = () => {
    setWidth(width + 100);
    setHeight(height + 30);
  };

  const decreaseSize = () => {
    setWidth(Math.max(300, width - 100));
    setHeight(Math.max(80, height - 30));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging.current) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  React.useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      className="spotify-player-wrapper"
      style={{ left: position.x, top: position.y }}
      ref={dragRef}
    >
      <div
        className="spotify-player-controls"
        onMouseDown={handleMouseDown}
        style={{ cursor: "move" }}
      >
        <button onClick={increaseSize}>➕</button>
        <button onClick={decreaseSize}>➖</button>
        <button onClick={onClose}>❌</button>
      </div>
      <div className="audio-player-info" style={{ padding: "8px", textAlign: "center" }}>
        <strong>{title}</strong> - <em>{artist}</em>
      </div>
      <audio
        src={trackUrl}
        controls
        style={{ width: width, height: height }}
      ></audio>
    </div>
  );
};

export default SpotifyPlayer;
