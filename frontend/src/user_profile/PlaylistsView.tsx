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
        style={{ width: '100%', maxWidth: '150px', height: 'auto' }} // Adjusted for mobile
      />
      <h2 className="h6 fw-bold text-truncate" style={{ maxWidth: "140px" }}>{name}</h2> {/* Prevents long names from breaking */}
    </div>
  );
}

function PlaylistsView() {
  const navigate = useNavigate();

  const handleBackButton = () => {
    console.log("Back button clicked");
    navigate('/userProfile');
  };

  return (
    <div className="container bg-white py-3">
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-light fs-3 me-2" aria-label="Go back" onClick={handleBackButton}>←</button>
        <h1 className="h4 fw-bold m-0">♬ Playlists</h1>
      </div>
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3"> 
        {artistData.map((artist, index) => (
          <div className="col d-flex justify-content-center" key={index}> 
            <ArtistCard name={artist.name} image={artist.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistsView;