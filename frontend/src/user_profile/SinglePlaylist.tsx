import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../user_profile/Sidebar';
import SpotifyPlayer from '../spotify_player/SpotifyPlayer';
import './Playlist.css'; 

const PlaylistPage: React.FC = () => {
  const { playlistName } = useParams<{ playlistName: string }>();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTrack, setActiveTrack] = useState<{ url: string; title: string; artist: string } | null>(null);
  const [playlistImage, setPlaylistImage] = useState<string | null>(null);

  useEffect(() => {
    if (playlistName) {
      // Fetch playlist songs
      fetch(`${process.env.REACT_APP_API_URL}backend/getPlaylistSongs.php?playlist=${encodeURIComponent(playlistName)}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setSongs(data.songs);
          } else {
            console.error("Error fetching playlist songs:", data.message);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching playlist songs:", err);
          setLoading(false);
        });

      // Fetch playlist image
      fetch(`${process.env.REACT_APP_API_URL}backend/getPlaylistImage.php?playlist=${encodeURIComponent(playlistName)}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setPlaylistImage(data.imageUrl);
          } else {
            console.error("Error fetching playlist image:", data.message);
          }
        })
        .catch(err => {
          console.error("Error fetching playlist image:", err);
        });
    }
  }, [playlistName]);

  const formatDuration = (duration: number): string => {
    const totalSeconds = Math.floor(duration / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSongClick = async (song: string, artist: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/playSong.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_name: song, artist_name: artist }),
      });

      const result = await response.json();
      if (result.status === 'success') {
        setActiveTrack({ url: result.trackUrl, title: song, artist: artist });
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  return (
    <div className="sp-artist-page">
      <Sidebar />
      <div className="sp-artist-content">
        <div className="sp-artist-header">
          {playlistImage && (
            <img src={playlistImage} alt={`${playlistName} cover`} className="sp-artist-picture" />
          )}
          <h1 className="sp-artist-title">
            {playlistName ? playlistName.charAt(0).toUpperCase() + playlistName.slice(1) : "Playlist"}
          </h1>
        </div>
        <h2 className="sp-top-songs-title">Songs</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="sp-songs-list">
            {songs.map((song, index) => (
              <li key={index} className="sp-song-item" onClick={() => handleSongClick(song.name, song.artist)}>
                <span className="sp-song-name">{song.name}</span>
                <span className="sp-song-duration">{formatDuration(song.duration)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {activeTrack && (
        <SpotifyPlayer
          trackUrl={activeTrack.url}
          title={activeTrack.title}
          artist={activeTrack.artist}
          onClose={() => setActiveTrack(null)}
        />
      )}
    </div>
  );
};

export default PlaylistPage;
