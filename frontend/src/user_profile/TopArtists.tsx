import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Artist {
    name: string;
    image: string;
}

function TopArtists() {
  const artists = [
    { name: 'Drake', image: './static/Drakepfp.png' },
    { name: 'Ado', image: './static/Adopfp.png' },
    { name: 'Beatles', image: './static/TheBeatlespfp.png' }
  ];
  const navigate = useNavigate();

  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/top-artists');
  };

  const handleArtistClick = (artist: Artist): void => {
    console.log(`Artist clicked: ${artist.name}`);
  };

  return (
    <div className="mt-4 px-3">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="h4 font-weight-bold">Top Artists</h2>
        <button className="btn btn-link text-dark p-0 h6" onClick={handleShowAllClick}>
          Show all
        </button>
      </div>
      <div className="row mt-3">
        {artists.map((artist, index) => (
          <div key={index} className="col-6 col-sm-4 mb-3 d-flex justify-content-center">
            <ArtistItem artist={artist} onClick={handleArtistClick} />
          </div>
        ))}
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
