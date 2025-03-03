// components/MobileTopArtists.tsx
import React from 'react';
import { Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Artist } from './MobileProfileTypes';

interface Props {
  artists: Artist[];
}

const MobileTopArtists: React.FC<Props> = ({ artists }) => {

const handleShowAllArtists = () => {
  console.log('useNaviagate Show all Playlists')
};

  return (
    <>
      <h3 className="mb-3">Top Artists This Month</h3>
      <div className="d-flex justify-content-center">
        {artists.map((artist, index) => (
          <Col key={index} xs={4} className="text-center">
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="rounded-circle border border-3"
              style={{ width: '120px', height: '120px' }}
            />
            <p>{artist.name}</p>
          </Col>
        ))}
      </div>
      <Button variant="secondary" className="w-100 mb-3" onClick={handleShowAllArtists}>Show all Artists</Button>
    </>
  );
};

export default MobileTopArtists;
