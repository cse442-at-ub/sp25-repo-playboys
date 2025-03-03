// components/MobilePlaylists.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { Playlist } from './MobileProfileTypes';
import { useNavigate } from 'react-router-dom';

interface Props {
  playlists: Playlist[];
}

const MobilePlaylists: React.FC<Props> = ({ playlists }) => {

  const navigate = useNavigate();
  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/playlist-view')
  };

  return (
    <>
      <h3 className="mt-4 mb-3">🎵 Playlists</h3>
      {playlists.map((playlist, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <div
            className="rounded border"
            style={{ width: '90px', height: '90px', backgroundColor: '#ddd' }}
          />
          <p className="ms-3 h4">{playlist.name}</p>
        </div>
      ))}
      <Button variant="secondary" className="w-100 mb-3" onClick={handleShowAllClick}>Show all playlists</Button>
    </>
  );
};

export default MobilePlaylists;
