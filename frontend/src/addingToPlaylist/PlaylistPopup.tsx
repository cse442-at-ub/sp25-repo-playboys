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

  const playlists = ['Liked Songs from Playboys', 'Playlist 1', 'Playlist 2', "Create New Playlist", "aaa"]; // placeholders

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
