import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Colors, Spacing, FontSizes } from '../style_guide';

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
    <div style={{ textAlign: 'center' }}>
      <img src={image} alt={`${name}'s profile`} style={{ width: '100%', maxWidth: '150px', height: 'auto', borderRadius: '50%', marginBottom: Spacing.sm }} />
      <h2 style={{ fontSize: FontSizes.sm, fontWeight: 600, maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h2>
    </div>
  );
}

function PlaylistsView() {
  const navigate = useNavigate();

  const handleBackButton = () => navigate('/userProfile');

  return (
    <div style={{ backgroundColor: Colors.white, padding: `${Spacing.md} ${Spacing.md}` }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: Spacing.sm }}>
        <button onClick={handleBackButton} style={{ background: 'none', border: 'none', fontSize: FontSizes.lg, marginRight: Spacing.sm }}>←</button>
        <Heading level={2}>♬ Playlists</Heading>
      </div>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-3">
        {artistData.map((artist, index) => (
          <div key={index} className="col d-flex justify-content-center">
            <ArtistCard name={artist.name} image={artist.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistsView;
