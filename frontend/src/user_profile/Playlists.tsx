import React from 'react';
import { useNavigate } from 'react-router-dom';

function Playlists() {
  const artists = [
    { name: 'Drake', image: './static/Drakepfp.png' },
    { name: 'Ado', image: './static/Adopfp.png' },
    { name: 'Beatles', image: './static/TheBeatlespfp.png' }
  ];

  const navigate = useNavigate();
  const handleShowAllClick = () => {
    console.log("Show all clicked");
    navigate('/playlist-view');
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
        {artists.map((artist, index) => (
          <div key={index} className="col-6 col-md-4">
            <ArtistItem artist={artist} onClick={() => console.log(artist.name)} />
          </div>
        ))}
      </div>
    </div>
  );
}

interface Artist {
  name: string;
  image: string;
}

function ArtistItem({ artist, onClick }: { artist: Artist; onClick: (artist: Artist) => void }) {
  return (
    <button
      className="text-center border-0 bg-transparent w-100"
      onClick={() => onClick(artist)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={artist.image}
        alt={`${artist.name} profile picture`}
        className="img-fluid rounded-circle mb-2"
        style={{ width: "120px", height: "120px" }} // Smaller size for mobile
      />
      <h3 className="fs-6 fw-bold text-truncate" style={{ maxWidth: "100px" }}>
        {artist.name}
      </h3>
    </button>
  );
}

export default Playlists;
