import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../user_profile/Sidebar';
import './artistPage.css';

const ArtistPage: React.FC = () => {
  const { artist } = useParams<{ artist: string }>();
  const [topSongs, setTopSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (artist) {
      fetch(`https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/backend/artistTopSongs.php?artist=${artist}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setTopSongs(data.topSongs);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching artist songs", err);
          setLoading(false);
        });
    }
  }, [artist]);

  return (
    <div className="artist-page">
      <Sidebar />
      <div className="artist-content">
        <h1 className="artist-title">
          {artist ? artist.charAt(0).toUpperCase() + artist.slice(1) : "Artist"}
        </h1>
        <h2>Top Songs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {topSongs.map((song, index) => (
              <li key={index}>
                {song.name} - {song.duration}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ArtistPage;
