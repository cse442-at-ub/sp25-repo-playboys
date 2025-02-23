import React from 'react';
import { useNavigate } from 'react-router-dom';

const artistData = [
  { name: '$$$', image: './static/Drakepfp.png' },
  { name: 'Short n Sweat', image: './static/Sabrinapfp.png' },
  { name: 'Apex Legends', image: './static/Postpfp.png' },
  { name: 'Doja Kat', image: './static/Adopfp.png' },
  { name: 'Tyler not very creative', image: './static/Yunopfp.png' },
  { name: 'King Kendrick', image: './static/Kendrickpfp.png' },
];

function ArtistCard({ name, image }) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={`${name}'s profile`}
        className="img-fluid rounded-circle mb-3"
        style={{ width: '100%', height: 'auto', maxWidth: '300px' }} // Set width to 100% and height to auto
      />
      <h2 className="h5 fw-bold">{name}</h2>
    </div>
  );
}

function PlaylistsView() {
  const navigate = useNavigate();

  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate('/'); // Navigate to the desired route
  };

  return (
    <div className="container-fluid bg-white">
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-4">
            <button className="btn btn-light btn-lg fs-3 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
            <h1 className="display-4 fw-bold">♬ Playlists</h1>
          </div>
          <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4"> {/* Adjust column count */}
            {artistData.map((artist, index) => (
              <div className="col" key={index}>
                <ArtistCard name={artist.name} image={artist.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistsView;
