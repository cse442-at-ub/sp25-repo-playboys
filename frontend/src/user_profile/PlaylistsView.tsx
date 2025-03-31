import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCSRFToken } from '../csrfContent';
interface Playlist {
  name: string;
  image: string;
}

function PlaylistsView() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // State to store playlist data
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  useEffect(() => {
    // Fetch the playlists from the backend when the component mounts
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopPlaylist.php`, {
          method: "GET",
          credentials: "include",
          headers: { 'CSRF-Token': csrfToken }
        });
        if (response.ok) {
          const data = await response.json(); // Assuming the response contains the playlist list
          if (data.includes("error")) {
            console.log("Error fetching playlists or not logged in");
          } else {
            setPlaylists(data);
          }
        } else {
          console.error("Error fetching playlists:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []); // Dependency array ensures the fetch runs once when the component mounts

  const handleBackButton = () => {
    console.log("Back button clicked");
    navigate('/userProfile'); // Navigate to user profile
  };

  return (
    <div className="container bg-white py-3">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-light fs-3 me-2" aria-label="Go back" onClick={handleBackButton}>
          ←
        </button>
        <h1 className="h4 fw-bold m-0">♬ Playlists</h1>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div className="col d-flex justify-content-center" key={index}>
              <PlaylistItem playlist={playlist} onClick={() => console.log(playlist.name)} />
            </div>
          ))
        ) : (
          <p>Loading playlists...</p> // Display a loading message until playlists are fetched
        )}
      </div>
    </div>
  );
}

function PlaylistItem({ playlist, onClick }: { playlist: Playlist; onClick: (playlist: Playlist) => void }) {
  return (
    <button
      className="text-center border-0 bg-transparent w-100"
      onClick={() => onClick(playlist)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={playlist.image}
        alt={`${playlist.name} playlist cover`}
        className="img-fluid rounded-circle mb-2"
        style={{ width: "120px", height: "120px" }} // Adjusted size for mobile
      />
      <h3 className="fs-6 fw-bold text-truncate" style={{ maxWidth: "100px" }}>
        {playlist.name}
      </h3>
    </button>
  );
}

export default PlaylistsView;
