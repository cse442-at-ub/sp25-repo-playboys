// PlaylistPopup.tsx
import React, { useState, useEffect } from 'react';
import './PlaylistPopup.css';

interface PlaylistPopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (playlist: string) => void;
  songTitle: string;
  songArtist: string;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({
  visible,
  onClose,
  onAdd,
  songTitle,
  songArtist,
}) => {
  const [playlists, setPlaylists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setLoading(true);
    setError(null);
    fetch(`${process.env.REACT_APP_API_URL}/backend/getUserPlaylists.php`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.playlists)) setPlaylists(data.playlists);
        else throw new Error('Unexpected response format');
      })
      .catch((err) => {
        console.error('Failed to fetch playlists:', err);
        setError('Could not load playlists.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [visible]);

  const handlePlaylistClick = (playlist: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/backend/addToPlaylist.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playlist,
        song_title: songTitle,
        artist_name: songArtist,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        onAdd(playlist);
        onClose();
      })
      .catch((err) => {
        console.error('Failed to add to playlist:', err);
        setError('Could not add to playlist.');
      });
  };

  if (!visible) return null;

  return (
    <div className="add-to-playlist-overlay">
      <div className="add-to-playlist-popup">
        <button className="close-popup" onClick={onClose}>×</button>
        <h3>Add to…</h3>
        {loading && <p>Loading playlists…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <ul>
            {playlists.map((pl) => (
              <li key={pl} onClick={() => handlePlaylistClick(pl)}>
                {pl}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PlaylistPopup;
