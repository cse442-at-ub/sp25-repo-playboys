import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from '../csrfContent';
interface Artist {
  name: string;
  image: string;
}

function TopArtistsView() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user");
  const [username, setUsername] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]); // State to store fetched artist data
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  useEffect(() => {
    // Fetch the top artists from the backend when the component mounts
    const fetchTopArtists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopArtist.php?user=${(user && user !== "null") ? user : ""}`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'CSRF-Token': csrfToken }
        });
        if (response.ok) {
          const data = await response.json(); // Assuming the response contains the artist list
          if (data.includes('error')) {
            console.log('Not logged in to Spotify');
          } else {
            setArtists(data);
          }
        } else {
          console.error('Error fetching top artists:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/usernameGrabber.php?user=${(user && user !== "null") ? user : ""}`, {
          method: "GET",
          credentials: "include",
          headers: { 'CSRF-Token': csrfToken }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.login_user) {
            setUsername(data.login_user);
            console.log("Logged in user:", data.login_user);
          } else {
            console.log("Username not found in response");
          }
        } else {
          console.error("Failed to fetch username:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    fetchUsername(); // Fetch username when the component mounts
    fetchTopArtists();
  }, []); // Dependency array ensures fetch runs once when the component mounts

  const handleBackButton = () => {
    console.log('Back button clicked');
    navigate('/userProfile'); // Navigate to the desired route
  };

  return (
    <div className="container-fluid bg-white px-3">
      <div className="d-flex align-items-center mb-3">
        <button
          className="btn btn-light btn-sm fs-5 me-2"
          aria-label="Go back"
          onClick={handleBackButton}
        >
          ←
        </button>
        <h1 className="h4 fw-bold mb-0">Your Top Artists</h1>
      </div>
      <div className="row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
        {artists.length > 0 ? (
          artists.map((artist, index) => (
            <div className="col d-flex justify-content-center" key={index}>
              <ArtistCard name={artist.name} image={artist.image} />
            </div>
          ))
        ) : (
          username === (user) || ((user || "") === "") ? (
            <p className="text-muted fst-italic">No Top Artist Found</p>
          ) : (
            <p className="text-muted fst-italic">No Top Artist Found</p>
          )
        )}
      </div>
    </div>
  );
}

interface ArtistCardProps {
  name: string;
  image: string;
}

function ArtistCard({ name, image }: ArtistCardProps) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={`${name}'s profile`}
        className="img-fluid rounded-circle mb-2"
        style={{ width: '90px', height: '90px' }} // Smaller size for mobile
      />
      <h2 className="h6 fw-bold text-truncate" style={{ maxWidth: '100px' }}>
        {name}
      </h2>
    </div>
  );
}

export default TopArtistsView;
