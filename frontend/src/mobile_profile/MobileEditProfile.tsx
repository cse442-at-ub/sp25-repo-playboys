import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, type, value, onChange }) => {
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-bold">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="form-control bg-light"
      />
    </div>
  );
};

interface ActionButtonProps {
  text: string;
  onClick: () => void;
  isPrimary?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text, onClick, isPrimary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${isPrimary ? 'btn-success' : 'btn-outline-secondary'}`}
    >
      {text}
    </button>
  );
};

const MobileEditProfile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSave = () => {
    console.log('Profile saved');
  };

  const handleCancel = () => {
    console.log('Edit cancelled');
    //navigate('/userProfile')
    navigate('/')
  };

  const handleChangePicture = () => {
    console.log('Change Picture Clicked');
  };

  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate('/');
    //navigate('/userProfile');
  };

  return (
    <div className="container-fluid bg-white p-4" style={{ maxWidth: '480px' }}>
      <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
      <h1 className="fw-bold mb-4 mt-4 mb-3">Edit Profile</h1>
      <div className="d-flex align-items-center mb-4">
        <img
          src="./static/ProfilePlaceholder.png"
          alt="User profile"
          className="rounded-circle me-3"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
        <button className="btn btn-light" onClick={handleChangePicture}>Change Picture</button>
      </div>
      <form>
        <InputField
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
        
        <InputField
          label="Email Address"
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <div className="d-flex justify-content-end mt-4" style={{ gap: '16px' }}>
          <ActionButton text="Cancel" onClick={handleCancel} />
          <ActionButton text="Save Profile" onClick={handleSave} isPrimary />
        </div>
      </form>
    </div>
  );
};

export default MobileEditProfile;