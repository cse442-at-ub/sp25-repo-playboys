// import React from 'react';
// import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// interface ProfileFieldProps {
//     label: string;
//     value: string;
//     isEmail?: boolean;  // Optional boolean prop
//   }
  
//   const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, isEmail = false }) => {
//     const inputId = `${label.toLowerCase().replace(/\s+/g, '-')}-input`;

//   return (
//     <Form.Group className="mb-4">
//       <Form.Label htmlFor={inputId} className="h4">{label}</Form.Label>
//       <Form.Control
//         type={isEmail ? "email" : "text"}
//         id={inputId}
//         value={value}
//         readOnly
//         className={isEmail ? "text-decoration-underline" : "font-weight-bold"}
//         style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
//       />
//     </Form.Group>
//   );
// }

// function EditProfile() {
//   const navigate = useNavigate(); // Move the useNavigate hook here
//   const handleBackButton = () => {
//     console.log("Show all clicked");
//     navigate('/userProfile'); // Navigate to the desired route
//     };

//     const handleSaveProfile = () => {
//         console.log("Handle Save Profile Clicked");
//         //Handle Save Profile Implememtation
//         };

//   return (
    
//     <Container className="py-5">
//     <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
//       <Row className="justify-content-center">
//         <Col md={8} lg={6}>
//           <h1 className="display-4 fw-bold">Edit Profile</h1>
//           <Image
//             src="./static/ProfilePlaceholder.png"
//             roundedCircle
//             width={200}
//             height={200}
//             className="d-block mx-auto mb-4"
//             alt="User profile"
//           />
//           <ProfileField label="User Name" value="@john_doe" />
//           <ProfileField label="Email Address" value="username@gmail.com" isEmail />
//           <div className="d-flex justify-content-between mt-5">
//             <Button variant="outline-secondary" size="lg" onClick={handleBackButton} >Cancel</Button>
//             <Button variant="success" size="lg">Save Profile</Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// }

// export default EditProfile;


import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("@john_doe");
  const [email, setEmail] = useState("username@gmail.com");
  const [message, setMessage] = useState(""); 
  const [isError, setIsError] = useState(false);

  const handleBackButton = () => {
    navigate('/userProfile');
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
        credentials: 'include',
      });
      const result = await response.json();

      if (result.status === "success") {
        setMessage("Profile updated successfully!");
        setIsError(false);
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

