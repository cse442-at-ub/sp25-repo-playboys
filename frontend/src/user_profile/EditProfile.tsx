import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Heading, PrimaryButton, SecondaryButton, Colors, Spacing } from '../style_guide';

const EditProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // fetch profile logic here...
  }, []);

  const handleBackButton = () => navigate('/userProfile');
  const handleSaveProfile = async () => { /* save logic */ };
  const handleUploadImage = async () => { /* upload logic */ };

  return (
    <Container className="py-5">
      <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Heading level={1}>Edit Profile</Heading>
          <div className="d-flex flex-column align-items-center mb-4">
            <Image src={profileImageUrl || "./static/ProfilePlaceholder.png"} roundedCircle width={200} height={200} className="d-block mx-auto mb-3" alt="User profile" />
            <div className="d-flex gap-2">
              <Form.Control type="file" accept="image/*" onChange={() => {}} ref={fileInputRef} style={{ display: 'none' }} />
              <SecondaryButton onClick={() => fileInputRef.current?.click()}>Choose Image</SecondaryButton>
              {profileImage && <PrimaryButton onClick={handleUploadImage}>Upload</PrimaryButton>}
            </div>
          </div>
          <Form.Group className="mb-4">
            <Form.Label className="h4">User Name</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ backgroundColor: Colors.background, padding: '23px 12px' }} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label className="h4">Email Address</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ backgroundColor: Colors.background, padding: '23px 12px' }} />
          </Form.Group>
          {message && <Alert variant={isError ? "danger" : "success"}>{message}</Alert>}
          <div className="d-flex justify-content-between mt-5">
            <SecondaryButton onClick={handleBackButton}>Cancel</SecondaryButton>
            <PrimaryButton onClick={handleSaveProfile}>Save Profile</PrimaryButton>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;