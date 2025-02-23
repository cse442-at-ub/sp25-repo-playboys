import React from 'react';
import { useNavigate } from 'react-router-dom';

const artistData = [
  { name: 'Drake', image: './static/Drakepfp.png' },
  { name: 'Sabrina Carpenter', image: './static/Sabrinapfp.png' },
  { name: 'Post Malone', image: './static/Postpfp.png' },
  { name: 'Ado', image: './static/Adopfp.png' },
  { name: 'Yuno Miles', image: './static/Yunopfp.png' },
  { name: 'Kendrick Lamar', image: './static/Kendrickpfp.png' },
];

function ArtistCard({ name, image }) {
  return (
    <div className="text-center">
      <img src={image} alt={`${name}'s profile`} className="img-fluid rounded-circle mb-3" />
      <h2 className="h5 fw-bold">{name}</h2>
    </div>
  );
}

function TopArtistsView() {
  const navigate = useNavigate(); // Move the useNavigate hook here

  const handleBackButton = () => {
    console.log("Show all clicked");
    navigate('/'); // Navigate to the desired route
  };

  return (
    <div className="container-fluid bg-white">
      <div className="row">
        <div className="col-lg-9">
          <div className="mb-4">
            <button className="btn btn-light btn-lg fs-2 p-10" aria-label="Go back" onClick={handleBackButton}>←</button>
            <h1 className="display-4 fw-bold">Your Top Artists</h1>
          </div>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {artistData.map((artist, index) => (
              <div className="col" key={index}>
                <ArtistCard name={artist.name} image={artist.image} />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-3"></div>
      </div>
    </div>
  );
}

export default TopArtistsView;
