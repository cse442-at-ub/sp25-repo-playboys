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
    <div className="d-flex justify-content-between align-items-center py-3 px-3">
      <img
      // logo is lcated in public/static/logo.jpg
        src={process.env.PUBLIC_URL + "/static/logo.jpg"}
        alt="Logo"
        style={{
          height: "80px",
          width: "80px",
          objectFit: "cover",
          borderRadius: "75%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
      <div className="d-flex gap-3">
        <Button
          variant="success"
          className="rounded-pill px-4 py-2"
          onClick={onLogin}
          style={{ transition: "all 0.3s ease" }}
        >
          Login
        </Button>
        <Button
          variant="warning"
          className="rounded-pill px-4 py-2"
          onClick={onSignUp}
          style={{ transition: "all 0.3s ease" }}
        >
          Sign Up
        </Button>
      </div>
    </div>
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
