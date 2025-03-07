import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface HeaderProps {
  onLogin: () => void; // Define the onLogin prop
  onSignUp: () => void; // Define the onSignUp prop
}

const Header: React.FC<HeaderProps> = ({ onLogin, onSignUp }) => {
    return (
      <Row className="align-items-center">
        <Col xs={12} md={6} className="text-center mb-3 mb-md-0">
          <div className="bg-primary text-white py-3 rounded-pill w-50">
            <h2 className="mb-0">Playboys</h2>
          </div>
        </Col>
  
        {/* Buttons container, making sure the buttons are stacked and their size remains consistent */}
        <Col xs={12} md={6} className="mt-3 mt-md-0">
          <div className="d-flex flex-column">
            <Button variant="success" className="w-50 py-2 rounded-pill mb-2" onClick={onLogin}>
              Login
            </Button>
            <Button variant="warning" className="w-50 py-2 rounded-pill" onClick={onSignUp}>
              Sign Up
            </Button>
          </div>
        </Col>
      </Row>
    );
  };
  
interface LandingPageProps {}

const MobileLandingPage: React.FC<LandingPageProps> = () => {
  const handleLogin = () => {
    // Handle login logic here
    window.location.href = "#/login";
  };

  const handleSignUp = () => {
    // Handle sign-up logic here
    window.location.href = "#/register";
  };

  return (
    <div className="landing-page">
      <Container fluid className="p-0">
        <div className="position-relative">
          <img
            src="./static/MobileLandingPageWallpaper.jpg"
            className="position-absolute w-100"
            alt="Background"
          />
          <div className="position-relative py-4 px-5 px-md-5 min-vh-100 d-flex flex-column">
            <Header onLogin={handleLogin} onSignUp={handleSignUp} />
            <Row className="mt-5">
              <Col>
                <h1 className="text-center text-warning display-3 fw-bold mt-5">
                  Your Music. <br />
                  Your Community. <br />
                  Your Identity.
                </h1>
                <p className="text-center text-white fs-4 mt-3">
                  Platform For All Fans
                </p>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MobileLandingPage;
