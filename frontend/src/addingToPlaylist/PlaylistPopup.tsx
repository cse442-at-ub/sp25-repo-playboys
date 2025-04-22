// PlaylistPopup.tsx
import React, { useState, useEffect } from 'react';
import './PlaylistPopup.css';

interface PlaylistPopupProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (playlist: string) => void;
}

const PlaylistPopup: React.FC<PlaylistPopupProps> = ({ visible, onClose, onAdd }) => {
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
        if (Array.isArray(data.playlists)) {
          setPlaylists(data.playlists);
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch playlists:', err);
        setError('Could not load playlists.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [visible]);

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
              <li key={pl} onClick={() => onAdd(pl)}>
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
