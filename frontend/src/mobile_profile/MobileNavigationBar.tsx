// components/MobileNavigationBar.tsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { FaCompass, FaChartBar, FaUser, FaCog, FaSearch } from 'react-icons/fa';

const MobileNavigationBar: React.FC = () => {
  return (
    <Container className="d-flex justify-content-around py-3 border-top bg-white fixed-bottom">
      <FaCompass size={24} />
      <FaChartBar size={24} />
      <FaSearch size={28} />
      <FaUser size={24} />
      <FaCog size={24} />
    </Container>
  );
};

export default MobileNavigationBar;



{/*}
import React, { useState } from 'react';
import { Container, Nav } from 'react-bootstrap';
import { FaCompass, FaChartBar, FaUser, FaCog, FaSearch } from 'react-icons/fa';

const MobileNavigationBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Container className="d-flex justify-content-around py-3 border-top bg-white fixed-bottom">
      <Nav className="w-100 d-flex justify-content-around">
        <Nav.Item onClick={() => handleTabClick('home')} className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}>
          <FaCompass size={24} />
        </Nav.Item>
        <Nav.Item onClick={() => handleTabClick('analytics')} className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}>
          <FaChartBar size={24} />
        </Nav.Item>
        <Nav.Item onClick={() => handleTabClick('search')} className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}>
          <FaSearch size={28} />
        </Nav.Item>
        <Nav.Item onClick={() => handleTabClick('profile')} className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}>
          <FaUser size={24} />
        </Nav.Item>
        <Nav.Item onClick={() => handleTabClick('settings')} className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}>
          <FaCog size={24} />
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default MobileNavigationBar;
*/}