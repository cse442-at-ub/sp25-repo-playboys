// PlaylistPopup.tsx
import React from 'react';
import './PlaylistPopup.css';

interface PlaylistPopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (playlist: string) => void;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({ visible, onClose, onAdd }) => {
  if (!visible) return null;

  const playlists = ['Favorites', 'Chill Vibes', 'Workout Mix']; // placeholders

  return (
    <div className="add-to-playlist-overlay">
      <div className="add-to-playlist-popup">
        <button className="close-popup" onClick={onClose}>×</button>
        <h3>Add to…</h3>
        <ul>
          {playlists.map((pl) => (
            <li key={pl} onClick={() => onAdd(pl)}>
              {pl}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlaylistPopup;
