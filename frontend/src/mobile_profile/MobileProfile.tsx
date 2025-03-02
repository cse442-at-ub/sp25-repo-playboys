// components/MobileProfile.tsx
import React from 'react';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import MobileTopArtists from './MobileTopArtists';
import MobilePlaylists from './MobilePlaylists';
import MobileRecentActivity from './MobileProfileRecentActivity';
import MobileNavigationBar from './MobileNavigationBar';
import { Artist, Activity, Playlist } from './MobileProfileTypes';

const topArtists: Artist[] = [
  { name: 'Drake', imageUrl: 'https://via.placeholder.com/80' },
  { name: 'Ado', imageUrl: 'https://via.placeholder.com/80' },
  { name: 'Beatles', imageUrl: 'https://via.placeholder.com/80' },
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
  return (
    <Container className="py-5">
      {/* Profile Header */}
      <Row className="mb-4 text-center">
        <Col>
          <Image
            src="https://via.placeholder.com/100"
            roundedCircle
            fluid
            className="mb-2"
          />
          <h2>John Doe</h2>
          <p className="text-muted">@john_doe</p>
          <p><strong>10</strong> Followers <strong>∞</strong> Following</p>
          <Button variant="secondary" size="sm">🖋️ Edit Profile</Button>
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
