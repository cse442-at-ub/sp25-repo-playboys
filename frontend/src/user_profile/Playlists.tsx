import React, { useEffect, useState, useRef } from 'react';
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
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const navigate = useNavigate();
  const { csrfToken } = useCSRFToken();
  const [isCreatePlaylistVisible, setIsCreatePlaylistVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const createPlaylistRef = useRef<HTMLDivElement>(null);
  const [createPlaylistError, setCreatePlaylistError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopPlaylist.php?user=${(user && user !== "null") ? user : ""}`, {
          method: "GET",
          credentials: "include",
          headers: { 'CSRF-Token': csrfToken }
        });
        if (response.ok) {
          const data = await response.json();
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
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    setPlaylists([]);
    setUsername("");
    fetchUsername();
    fetchPlaylists();
  }, [user, csrfToken]);

  const handleShowAllClick = () => {
    navigate('/playlist-view?user=' + (user && user !== "null" ? user : ""));
  };

  const toggleCreatePlaylist = () => {
    setIsCreatePlaylistVisible(!isCreatePlaylistVisible);
    setNewPlaylistName('');
    setCreatePlaylistError(null); // Clear any previous error
  };

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const queryString = new URLSearchParams({ name: newPlaylistName }).toString();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}backend/playlist/createPlaylist.php?${queryString}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json',
              'CSRF-Token': csrfToken,
            },
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          fetch(`${process.env.REACT_APP_API_URL}backend/userTopPlaylist.php?user=${(user && user !== "null") ? user : ""}`, {
            method: "GET",
            credentials: "include",
            headers: { 'CSRF-Token': csrfToken }
          })
            .then(res => res.json())
            .then(playlistData => {
              if (!playlistData.includes("error")) {
                setPlaylists(playlistData);
              }
            })
            .catch(error => console.error("Error refreshing playlists:", error));

          setIsCreatePlaylistVisible(false);
          setNewPlaylistName('');
          setCreatePlaylistError(null);
          console.log("Playlist created successfully!");
        } else {
          setCreatePlaylistError(data.message || "Something went wrong");
          console.error("Error creating playlist:", data.message || "Something went wrong");
        }
      } catch (error) {
        setCreatePlaylistError("Failed to connect to the server.");
        console.error("Error creating playlist:", error);
      }
    } else {
      setCreatePlaylistError("Playlist name cannot be empty.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h3 fw-bold">
          {username === user || user === "" ? (
                  "My Playlists"
                ) : (
                  `${user}'s Playlists`
            )}
        </h2>
        <div className="position-relative d-flex justify-content-end" style={{ width: '80px' }}>
        {username === user || user === "" ? (
          <button
            className="btn btn-success rounded-circle d-flex justify-content-center align-items-center p-0"
            aria-label="Create new playlist"
            onClick={toggleCreatePlaylist}
            style={{ width: '32px', height: '32px', fontSize: '1.2em' }}
          >
            +
          </button>
        ): null}
          {isCreatePlaylistVisible && (
            <div ref={createPlaylistRef} className="position-absolute top-100 end-0 mt-2 bg-light border rounded shadow-sm p-3" style={{ zIndex: 10, maxWidth: 'calc(100vw - 30px)', width: '200px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 fw-bold">New Playlist</h6>
                <button className="btn btn-sm btn-outline-secondary p-0 rounded-circle" onClick={toggleCreatePlaylist} aria-label="Close" style={{ width: '24px', height: '24px', lineHeight: '1' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              </div>
              <div className="mb-3">
                <label htmlFor="newPlaylistName" className="form-label visually-hidden">Playlist Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="newPlaylistName"
                  placeholder="Playlist Name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  maxLength={15}
                />
              </div>
              <button className="btn btn-success btn-sm w-100" onClick={handleCreatePlaylist}>
                Create
              </button>
              {createPlaylistError && (
                <p className="text-danger mt-2 mb-0">{createPlaylistError}</p>
              )}
            </div>
          )}
        </div>
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
            <p className="text-muted fst-italic">No Playlist found</p>
          ) : (
            <p className="text-muted fst-italic">No Playlist found</p>
          )
        )}
      </div>
    </div>
  );
}

interface PlaylistItemProps {
  playlist: Playlist;
  onClick: (playlist: Playlist) => void;
}

function PlaylistItem({ playlist, onClick }: PlaylistItemProps) {
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
        style={{ width: "120px", height: "120px" }}
      />
      <h3 className="fs-6 fw-bold text-truncate" style={{ maxWidth: "100px" }}>
        {playlist.name}
      </h3>
    </button>
  );
}

export default Playlists;