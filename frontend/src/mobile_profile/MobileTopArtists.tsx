// components/MobileTopArtists.tsx
import React from 'react';
import { Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Artist } from './MobileProfileTypes';
import { useNavigate } from 'react-router-dom';

interface Props {
  artists: Artist[];
}

const MobileTopArtists: React.FC<Props> = ({ artists }) => {

  const navigate = useNavigate();
  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/top-artists')
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
      <Button variant="secondary" className="w-100 mb-3" onClick={handleShowAllClick}>Show all Artists</Button>
    </>
  );
};

export default MobileTopArtists;
