import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
  
        console.log("API Response:", result);
  
        if (result.status === "success") {
          setUsername(result.data.username);
          setEmail(result.data.email);
        } else {
          setMessage("Failed to load profile.");
          setIsError(true);
        }
      } catch (error) {
        setMessage("An error occurred while fetching profile.");
        setIsError(true);
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleBackButton = () => {
    navigate('/userProfile');
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
        credentials: "include",
      });
      const result = await response.json();

      if (result.status === "success") {
        setMessage("Profile updated successfully!");
        setIsError(false);
        navigate('/userProfile');
      } else if (result.status === "same") {
        setMessage(result.message || "Profile is the same.");
        navigate('/userProfile');
      } else {
        setMessage(result.message || "Failed to update profile.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred while updating the profile.");
      setIsError(true);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container fluid className="py-5 px-3">
      <button className="btn btn-light btn-lg fs-3 p-2 mb-3 d-sm-inline d-block w-100 text-start" 
        aria-label="Go back" 
        onClick={handleBackButton}>
        ←
      </button>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} className="p-md-4 p-2">
          <h1 className="display-6 fw-bold text-center">Edit Profile</h1>
          
          <div className="d-flex justify-content-center">
            <Image
              src="./static/ProfilePlaceholder.png"
              roundedCircle
              width="100%"
              style={{ maxWidth: "200px" }}
              className="d-block mb-4"
              alt="User profile"
            />
          </div>

          <Form.Group className="mb-3">
            <Form.Label className="h5">User Name</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-weight-bold"
              style={{ backgroundColor: '#ededed', padding: '15px' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="h5">Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-decoration-underline"
              style={{ backgroundColor: '#ededed', padding: '15px' }}
            />
          </Form.Group>

          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 mt-4">
            <Button variant="outline-secondary" size="lg" className="w-100">Cancel</Button>
            <Button variant="success" size="lg" className="w-100" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
