import React from 'react';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import MobileNaviagtionBar from './MobileNavigationBar';
import { useNavigate } from 'react-router-dom';

interface Artist {
  name: string;
  hoursListened: number;
  imageUrl: string;
}

const artists: Artist[] = [
  { name: 'Drake', hoursListened: 10000, imageUrl: './static/Drakepfp.png' },
  { name: 'Beatles', hoursListened: 420, imageUrl: './static/TheBeatlespfp.png' },
  { name: 'Ado', hoursListened: 69, imageUrl: './static/Adopfp.png' },
];

const ArtistCard: React.FC<Artist> = ({ name, hoursListened, imageUrl }) => {
  return (
    <div className="bg-light p-3 mb-3 rounded">
      <Row>
        <Col xs={3}>
          <Image src={imageUrl} alt={`${name}'s profile`} roundedCircle fluid />
        </Col>
        <Col xs={9}>
          <p className="mb-0">{hoursListened} Hours Listened</p>
          <h5 className="mt-2">{name}</h5>
        </Col>
      </Row>
    </div>
  );
};

const MobileTopArtistsPage: React.FC = () => {

  const navigate = useNavigate();
  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate('/');
    //navigate('/userProfile');
  };

  return (
    <Container className="py-4" style={{ maxWidth: '480px' }}>
      <header className="mb-4">
      <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
        <h1 className="mt-4 mb-3">Top Artists This Month</h1>
      </header>
      <main>
        {artists.map((artist, index) => (
          <ArtistCard key={index} {...artist} />
        ))}
      </main>
      <footer className="mt-5">
        <hr />
        <MobileNaviagtionBar />
      </footer>
    </Container>
  );
};

export default MobileTopArtistsPage;