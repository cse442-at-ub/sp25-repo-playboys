import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false);

  //grab the username and email from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
  
        console.log("API Response:", result); // Debugging
  
        // Check if username & email exist before setting state
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

  // Update the user profile
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
    <Container className="py-5">
      <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-4 fw-bold">Edit Profile</h1>
          <Image
            src="./static/ProfilePlaceholder.png"
            roundedCircle
            width={200}
            height={200}
            className="d-block mx-auto mb-4"
            alt="User profile"
          />
          <Form.Group className="mb-4">
            <Form.Label className="h4">User Name</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-weight-bold"
              style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="h4">Email Address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-decoration-underline"
              style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
            />
          </Form.Group>

          {message && (
            <Alert variant={isError ? "danger" : "success"}>{message}</Alert>
          )}

          <div className="d-flex justify-content-between mt-5">
            <Button variant="outline-secondary" size="lg" onClick={handleBackButton}>Cancel</Button>
            <Button variant="success" size="lg" onClick={handleSaveProfile}>Save Profile</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;
