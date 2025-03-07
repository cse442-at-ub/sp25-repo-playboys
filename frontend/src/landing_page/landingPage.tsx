import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLogin: () => void;
  onSignUp: () => void;
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

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div style={styles.page}>
      <Container fluid className="p-0">
        <div style={styles.overlay}>
          <div className="position-relative py-4 px-5 min-vh-100 d-flex flex-column">
            <Header onLogin={handleLogin} onSignUp={handleSignUp} />
            <Row className="mt-5 pt-5">
              <Col>
                <h1 className="text-center text-warning display-3 fw-bold mt-5">
                  Your Music. <br />
                  Your Community. <br />
                  Your Identity.
                </h1>
                <p className="text-center text-white fs-4 mt-3">Platform For All Fans</p>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    width: "100vw",
    height: "100vh",
    backgroundImage: "url('./static/LandingPageWallpaper.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional dark overlay for better readability
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default LandingPage;
