import React, { useEffect, useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCSRFToken } from '../csrfContent';

interface Artist {
    name: string;
    image: string;
}

function TopArtists() {
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user") || "";
  const [username, setUsername] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]); // State to store artists data
  const navigate = useNavigate();
  
  const { csrfToken } = useCSRFToken();
  
  useEffect(() => {
    // Fetch the top artists from the backend when the component mounts
    const fetchTopArtists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopArtist.php?user=${(user && user !== "null") ? user : ""}`, {
          method: "GET",
          credentials: "include",
          headers: { 'CSRF-Token': csrfToken }
        }); 
        if (response.ok) {
          const data = await response.json(); // Assuming the response contains the artist list
          if(data.includes("error")){
            console.log("Not login to spotify");
          }
          setArtists(data);
          
        } else {
          console.error('Error fetching top artists:', response.statusText);
        }
      } catch (error) {
        console.error("Error fetching top artists:", error);
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

  setArtists([]);
  setUsername("");
  fetchTopArtists();
  fetchUsername(); // <- NEW

}, [user]);

  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/top-artists?user=' + (user && user !== "null" ? user : "")); // Pass the user parameter to the new route
  };

  const handleArtistClick = (artist: Artist): void => {
    console.log(`Artist clicked: ${artist.name}`);
    navigate(`/explore/artist/${artist.name.toLowerCase()}`);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h3 fw-bold">
          {username === user || user === "" ? (
                  "My Top Artists"
                ) : (
                  `${user}'s Top Artists`
          )}
        </h2>
        <button className="btn btn-link text-dark fw-semibold" onClick={handleShowAllClick}>
          Show all
        </button>
      </div>
      <div className="row mt-3">
        {artists.length > 0 ? (
          artists.slice(0, 3).map((artist, index) => ( // Slice the array to get only the first three artists
            <div key={index} className="col-6 col-sm-4 mb-3 d-flex justify-content-center">
              <ArtistItem artist={artist} onClick={handleArtistClick} />
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

function ArtistItem({ artist, onClick }: { artist: Artist; onClick: (artist: Artist) => void }) {
  return (
    <button
      className="text-center border-0 bg-transparent"
      onClick={() => onClick(artist)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        width: "100%"
      }}
    >
      <img
        src={artist.image}
        alt={`${artist.name} profile`}
        className="img-fluid rounded-circle mb-2"
        style={{ width: "100px", height: "100px" }} // Smaller size for mobile
      />
      <h3 className="h6 font-weight-bold text-truncate" style={{ maxWidth: "90px" }}>{artist.name}</h3>
    </button>
  );
}

export default TopArtists;



