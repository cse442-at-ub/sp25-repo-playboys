import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  playlistName: string;
  username: string;
  onClose: () => void;
}

const DeletePlaylistModal: React.FC<Props> = ({ isOpen, playlistName, username, onClose }) => {
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (confirmName !== playlistName) {
      setError('Playlist name does not match.');
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/deletePlaylist.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, playlist: playlistName })
      });
      const result = await response.json();
      if (result.status === 'success') {
        // Redirect to the user's playlists overview
        window.location.href = `/userprofile`;
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error deleting playlist.');
    }
  };

  return (
    <div className="pp-modal-overlay">
      <div className="pp-modal">
        <h2>Delete Playlist</h2>
        <p>Type <strong>{playlistName}</strong> to confirm deletion.</p>
        <input
          type="text"
          className="pp-modal-input"
          value={confirmName}
          onChange={e => setConfirmName(e.target.value)}
          placeholder="Playlist name"
        />
        {error && <p className="pp-modal-error">{error}</p>}
        <div className="pp-modal-buttons">
          <button className="pp-modal-button cancel" onClick={onClose}>Cancel</button>
          <button className="pp-modal-button confirm" onClick={handleConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlaylistModal;