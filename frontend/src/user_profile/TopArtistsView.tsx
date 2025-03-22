import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Colors, Spacing, FontSizes } from '../style_guide';

const artistData = [
  { name: 'Drake', image: './static/Drakepfp.png' },
  { name: 'Sabrina Carpenter', image: './static/Sabrinapfp.png' },
  { name: 'Post Malone', image: './static/Postpfp.png' },
  { name: 'Ado', image: './static/Adopfp.png' },
  { name: 'Yuno Miles', image: './static/Yunopfp.png' },
  { name: 'Kendrick Lamar', image: './static/Kendrickpfp.png' },
];

interface ArtistCardProps {
  name: string;
  image: string;
}

function ArtistCard({ name, image }: ArtistCardProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <img
        src={image}
        alt={`${name}'s profile`}
        style={{ width: '90px', height: '90px', borderRadius: '50%', marginBottom: Spacing.sm, objectFit: 'cover' }}
      />
      <h2 style={{ fontSize: FontSizes.sm, fontWeight: 600, maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h2>
    </div>
  );
}

function TopArtistsView() {
  const navigate = useNavigate();

  const handleBackButton = () => navigate('/userProfile');

  return (
    <div style={{ backgroundColor: Colors.white, padding: `0 ${Spacing.md}` }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: Spacing.sm }}>
        <button onClick={handleBackButton} style={{ background: 'none', border: 'none', fontSize: FontSizes.base, marginRight: Spacing.sm }}>←</button>
        <Heading level={2}>Your Top Artists</Heading>
      </div>
      <div className="row row-cols-3 row-cols-sm-4 row-cols-md-5 row-cols-lg-6 g-3">
        {artistData.map((artist, index) => (
          <div key={index} className="col d-flex justify-content-center">
            <ArtistCard name={artist.name} image={artist.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopArtistsView;