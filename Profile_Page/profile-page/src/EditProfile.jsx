import React from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ProfileField({ label, value, isEmail = false }) {
  const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-input`;

  return (
    <Form.Group className="mb-4">
      <Form.Label htmlFor={inputId} className="h4">{label}</Form.Label>
      <Form.Control
        type={isEmail ? "email" : "text"}
        id={inputId}
        value={value}
        readOnly
        className={isEmail ? "text-decoration-underline" : "font-weight-bold"}
        style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
      />
    </Form.Group>
  );
}

function EditProfile() {
  const navigate = useNavigate(); // Move the useNavigate hook here
  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate('/'); // Navigate to the desired route
    };

    const handleSaveProfile = () => {
        console.log("Handle Save Profile Clicked");
        //Handle Save Profile Implememtation
        };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
        <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
          <h1 className="display-4 fw-bold">Edit Profile</h1>
          <Image
            src="./static/ProfilePlaceholder.png"
            roundedCircle
            width={200}
            height={200}
            className="d-block mx-auto mb-4"
            alt="User profile"
          />
          <ProfileField label="User Name" value="@john_doe" />
          <ProfileField label="Email Address" value="username@gmail.com" isEmail />
          <div className="d-flex justify-content-between mt-5">
            <Button variant="outline-secondary" size="lg" onClick={handleBackButton} >Cancel</Button>
            <Button variant="success" size="lg">Save Profile</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default EditProfile;