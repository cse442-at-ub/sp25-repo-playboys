import React from 'react';
import { Container } from 'react-bootstrap';

// Define handler functions
const MobileExploreHandler = () => {
  console.log('Explore clicked');
};

const MobileStatisticHandler = () => {
  console.log('Statistics clicked');
};

const MobileSearchHandler = () => {
  console.log('Search clicked');
};

const MobileProfileHandler = () => {
  console.log('Profile clicked');
};

const MobileSettingHandler = () => {
  console.log('Settings clicked');
};

const MobileNavigationBar: React.FC = () => {
  return (
    <Container className="mobile-nav-bar">
      <button onClick={MobileExploreHandler} className="nav-button border-0">
        <img src={'./static/ExploreIcon.png'} alt="Explore" className="nav-icon" />
      </button>

      <button onClick={MobileStatisticHandler} className="nav-button border-0">
        <img src={'./static/StatisticIcon.png'} alt="Statistics" className="nav-icon" />
      </button>

      <button onClick={MobileSearchHandler} className="nav-button border-0">
        <img src={'./static/MobileSearchIcon.png'} alt="Search" className="nav-icon" />
      </button>

      <button onClick={MobileProfileHandler} className="nav-button border-0">
        <img src={'./static/ProfileIcon.png'} alt="Profile" className="nav-icon" />
      </button>

      <button onClick={MobileSettingHandler} className="nav-button border-0">
        <img src={'./static/SettingIcon.png'} alt="Settings" className="nav-icon" />
      </button>
    </Container>
  );
};

export default MobileNavigationBar;