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
      <Col md={6}>
        <div className="bg-primary text-white text-center py-3 rounded-pill">
          <h2 className="mb-0">Playboys</h2>
        </div>
      </Col>
      <Col md={3} className="mt-3 mt-md-0">
        <Button variant="success" className="w-100 py-2 rounded-pill" onClick={onLogin}>
          Login
        </Button>
      </Col>
      <Col md={3} className="mt-3 mt-md-0">
        <Button variant="warning" className="w-100 py-2 rounded-pill" onClick={onSignUp}>
          Sign Up
        </Button>
      </Col>
    </Row>
  );
};

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login button clicked');

  };

  const handleSignUp = () => {
    // Handle sign-up logic here
    console.log('Sign Up button clicked');

  };

  return (
    <div className="landing-page">
      <Container fluid className="p-0">
        <div className="position-relative">
          <img
            src="./static/LandingPageWallpaper.png"
            className="position-absolute"
            alt="Background"
          />
          <div className="position-relative py-4 px-5 px-md-5 min-vh-100 d-flex flex-column">
            <Header onLogin={handleLogin} onSignUp={handleSignUp} />
            <Row className="mt-5 pt-5 ms-5">
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

export default LandingPage;
