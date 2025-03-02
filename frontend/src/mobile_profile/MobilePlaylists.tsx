// components/MobilePlaylists.tsx
import React from 'react';
import { Button } from 'react-bootstrap';
import { Playlist } from './MobileProfileTypes';

interface Props {
  playlists: Playlist[];
}

const MobilePlaylists: React.FC<Props> = ({ playlists }) => {
  return (
    <>
      <h3 className="mt-4 mb-3">🎵 Playlists</h3>
      {playlists.map((playlist, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <div
            className="rounded border"
            style={{ width: '60px', height: '60px', backgroundColor: '#ddd' }}
          />
          <p className="ms-3">{playlist.name}</p>
        </div>
      ))}
      <Button variant="secondary" className="w-100">Show all playlists</Button>
    </>
  );
};

export default MobilePlaylists;
