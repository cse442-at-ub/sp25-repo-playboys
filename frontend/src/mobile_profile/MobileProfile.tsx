// components/MobileProfile.tsx
import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import MobileTopArtists from './MobileTopArtists';
import MobilePlaylists from './MobilePlaylists';
import MobileRecentActivity from './MobileProfileRecentActivity';
import MobileNavigationBar from './MobileNavigationBar';
import { Artist, Activity, Playlist } from './MobileProfileTypes';
import { useNavigate } from 'react-router-dom';

const topArtists: Artist[] = [
  { name: 'Drake', imageUrl: './static/Drakepfp.png' },
  { name: 'Ado', imageUrl: './static/Adopfp.png' },
  { name: 'Beatles', imageUrl: './static/TheBeatlespfp.png' },
];

const playlists: Playlist[] = [
  { name: 'Vibe Check 🎧', imageUrl: '' },
  { name: 'My Favorites', imageUrl: '' },
];

const recentActivities: Activity[] = [
  { type: '♡', content: 'Blinding Lights', time: '1 hr ago' },
  { type: '+', content: 'Pray for Me', time: '10 min ago' },
  { type: '→', content: 'Taylor Swift', time: '1 day ago' },
];

const MobileProfile: React.FC = () => {

  const navigate = useNavigate();
  const handleEditProfile = () => {
    console.log('useNaviagate Edit Profile')
    navigate('/edit-profile')
  };

  return (
    <Container className="py-5">
      {/* Profile Header */}
      <Row className="mb-5 text-center">
        <Col>
          <Image
            src="./static/ProfilePlaceholder.png"
            roundedCircle
            fluid
            className="mb-2 profile-img"
          />
          <h1>John Doe</h1>
          <p className="text-muted h2">@john_doe</p>
          <p className="h5"><strong>10</strong> Followers <strong>∞</strong> Following</p>
          <Button variant="secondary" size="lg" onClick={handleEditProfile}>🖋️ Edit Profile</Button>
        </Col>
      </Row>

      {/* Components */}
      <MobileTopArtists artists={topArtists} />
      <MobilePlaylists playlists={playlists} />
      <MobileRecentActivity activities={recentActivities} />

      {/* Navigation Bar */}
      <MobileNavigationBar />
    </Container>
  );
};

export default MobileProfile;
