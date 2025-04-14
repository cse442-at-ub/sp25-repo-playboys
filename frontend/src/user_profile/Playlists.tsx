import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from '../csrfContent';
interface Playlist {
  name: string;
  image: string;
}

function Playlists() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user") || "";
  const [username, setUsername] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]); // State to store playlist data
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  useEffect(() => {
    // Fetch the playlists from the backend when the component mounts
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopPlaylist.php?user=${(user && user !== "null") ? user : ""}`, {
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

    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/usernameGrabber.php`, {
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
    setPlaylists([]);
    setUsername("");
    fetchUsername();
    fetchPlaylists();
  }, [user]); // Dependency array ensures the fetch runs once when the component mounts

  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/playlist-view?user=' + (user && user !== "null" ? user : "")); // Navigate to the playlist view page
  };

  return (
    <div className="mt-4 px-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="h3 fw-bold">♬ Playlists</h2>
        <button className="btn btn-link text-dark fw-semibold" onClick={handleShowAllClick}>
          Show all
        </button>
      </div>
      <div className="row mt-3 g-3">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div key={index} className="col-6 col-md-4">
              <PlaylistItem playlist={playlist} onClick={() => navigate(`/playlist/${playlist.name}?user=${username || user}`)} />
            </div>
          ))
        ) : (
          username === (user) || ((user || "") === "") ? (
            <p>Please Login in with Spotify</p>
          ) : (
            <p>{user} has no Playlist</p>
          )
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
        style={{ width: "120px", height: "120px" }} // Smaller size for mobile
      />
      <h3 className="fs-6 fw-bold text-truncate" style={{ maxWidth: "100px" }}>
        {playlist.name}
      </h3>
    </button>
  );
}

export default Playlists;
