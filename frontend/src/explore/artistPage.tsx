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
    fetch(`http://localhost/musicApp/artistTopSongs.php?artist=${artist}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setTopSongs(data.topSongs); 
        } else {
          console.error("Error fetching top songs:", data.message);
        } setLoading(false); })
        .catch(err => {
          console.error("Error fetching artist songs", err);
          setLoading(false);
        });
  }
}, [artist]);

function formatDuration(duration: number): string {
  const totalSeconds = Math.floor(duration / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Handle song click for playing song (need to update)
const handleSongClick = (song: any) => {
  console.log("Song clicked:", song);
};

return ( 
<div className="artist-page"> 
  <Sidebar />
  <div className="artist-content">
    <h1 className="artist-title">
      {artist ? artist.charAt(0).toUpperCase() + artist.slice(1) : "Artist"} 
    </h1>
    <h2 className="top-songs-title">Top Songs</h2>
    {loading ? ( <p>Loading...</p> ) : (
      <ul className="songs-list">
      {topSongs.map((song, index) => (
        <li key={index} className="song-item"
        onClick={() => handleSongClick(song)}>
          <span className="song-name">{song.name} </span>
          <span className="song-duration">{formatDuration(song.duration)}</span> 
        </li> ))} 
        </ul> )} 
  </div>
</div> 
); 
};

export default ArtistPage;