// import React, { useState, useEffect, useRef } from 'react';
// import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// const EditProfile = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [isError, setIsError] = useState(false);
//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
//           method: "GET",
//           credentials: "include",
//         });
//         const result = await response.json();

//         console.log("API Response:", result);

//         if (result.status === "success") {
//           setUsername(result.data.username);
//           setEmail(result.data.email);
//         } else {
//           setMessage("Failed to load profile.");
//           setIsError(true);
//         }
//       } catch (error) {
//         setMessage("An error occurred while fetching profile.");
//         setIsError(true);
//         console.error("Error fetching profile:", error);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const handleBackButton = () => {
//     navigate('/userProfile');
//   };

//   const handleSaveProfile = async () => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}backend/updateProfile.php`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, email }),
//         credentials: "include",
//       });
//       const result = await response.json();

//       if (result.status === "success") {
//         setMessage("Profile updated successfully!");
//         setIsError(false);
//         navigate('/userProfile');
//       } else if (result.status === "same") {
//         setMessage(result.message || "Profile is the same.");
//         navigate('/userProfile');
//       } else {
//         setMessage(result.message || "Failed to update profile.");
//         setIsError(true);
//       }
//     } catch (error) {
//       setMessage("An error occurred while updating the profile.");
//       setIsError(true);
//       console.error("Error updating profile:", error);
//     }
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setProfileImage(e.target.files[0]);
//     }
//   };

//   const handleUploadImage = async () => {
//     if (!profileImage) {
//       setMessage("Please select an image to upload.");
//       setIsError(true);
//       return;
//     }

//     const formData = new FormData();
//     formData.append('profileImage', profileImage);

//     try {
//       const response = await fetch(`${process.env.REACT_APP_API_URL}backend/profileUpload.php`, {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });
//       const result = await response.json();

//       if (result.status === "success") {
//         setMessage("Profile image uploaded successfully!");
//         setProfileImage("." + result.fileName);
//         setIsError(false);
//       } else {
//         setMessage(result.message || "Failed to upload profile image.");
//         setIsError(true);
//       }
//     } catch (error) {
//       setMessage("An error occurred while uploading the profile image.");
//       setIsError(true);
//       console.error("Error uploading profile image:", error);
//     }
//   };

//   return (
//     <Container className="py-5">
//       <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>
//         ←
//       </button>
//       <Row className="justify-content-center">
//         <Col md={8} lg={6}>
//           <h1 className="display-4 fw-bold">Edit Profile</h1>
//           <div className="d-flex flex-column align-items-center mb-4">
//             <Image
//               src={profileImage ? URL.createObjectURL(profileImage) : "./static/ProfilePlaceholder.png"}
//               roundedCircle
//               width={200}
//               height={200}
//               className="d-block mx-auto mb-3"
//               alt="User profile"
//             />
//             <div className="d-flex gap-2">
//               <Form.Control
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 ref={fileInputRef}
//                 style={{ display: 'none' }}
//               />
//               <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
//                 Choose Image
//               </Button>
//               {profileImage && (
//                 <Button variant="success" onClick={handleUploadImage}>
//                   Upload
//                 </Button>
//               )}
//             </div>
//           </div>
//           <Form.Group className="mb-4">
//             <Form.Label className="h4">User Name</Form.Label>
//             <Form.Control
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="font-weight-bold"
//               style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
//             />
//           </Form.Group>
//           <Form.Group className="mb-4">
//             <Form.Label className="h4">Email Address</Form.Label>
//             <Form.Control
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="text-decoration-underline"
//               style={{ backgroundColor: '#ededed', padding: '23px 12px' }}
//             />
//           </Form.Group>

//           {message && <Alert variant={isError ? "danger" : "success"}>{message}</Alert>}

//           <div className="d-flex justify-content-between mt-5">
//             <Button variant="outline-secondary" size="lg" onClick={handleBackButton}>
//               Cancel
//             </Button>
//             <Button variant="success" size="lg" onClick={handleSaveProfile}>
//               Save Profile
//             </Button>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default EditProfile;

import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // to store the image URL
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          setProfileImageUrl(result.data.profile_pic || null); // If the image URL exists in response
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setProfileImageUrl(URL.createObjectURL(e.target.files[0])); // Create object URL for the selected file
    }
  };

  const handleUploadImage = async () => {
    if (!profileImage) {
      setMessage("Please select an image to upload.");
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', profileImage);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}backend/profileUpload.php`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await response.json();

      if (result.status === "success") {
        setMessage("Profile image uploaded successfully!");
        setProfileImageUrl(result.fileName); // Set the relative path for the uploaded image
        setIsError(false);
      } else {
        setMessage(result.message || "Failed to upload profile image.");
        setIsError(true);
      }
    } catch (error) {
      setMessage("An error occurred while uploading the profile image.");
      setIsError(true);
      console.error("Error uploading profile image:", error);
    }
  };

  return (
    <Container className="py-5">
      <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>
        ←
      </button>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="display-4 fw-bold">Edit Profile</h1>
          <div className="d-flex flex-column align-items-center mb-4">
            <Image
              src={profileImageUrl || "./static/ProfilePlaceholder.png"} // Display the uploaded image or the placeholder 
              roundedCircle
              width={200}
              height={200}
              className="d-block mx-auto mb-3"
              alt="User profile"
            />
            <div className="d-flex gap-2">
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
                Choose Image
              </Button>
              {profileImage && (
                <Button variant="success" onClick={handleUploadImage}>
                  Upload
                </Button>
              )}
            </div>
          </div>
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

          {message && <Alert variant={isError ? "danger" : "success"}>{message}</Alert>}

          <div className="d-flex justify-content-between mt-5">
            <Button variant="outline-secondary" size="lg" onClick={handleBackButton}>
              Cancel
            </Button>
            <Button variant="success" size="lg" onClick={handleSaveProfile}>
              Save Profile
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;


