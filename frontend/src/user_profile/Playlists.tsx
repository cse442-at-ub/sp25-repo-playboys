import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading, Colors, Spacing, FontSizes } from '../style_guide';

interface Artist {
  name: string;
  image: string;
}

function Playlists() {
  const artists: Artist[] = [
    { name: 'Drake', image: './static/Drakepfp.png' },
    { name: 'Ado', image: './static/Adopfp.png' },
    { name: 'Beatles', image: './static/TheBeatlespfp.png' }
  ];

  const navigate = useNavigate();
  const handleShowAllClick = () => navigate('/playlist-view');

  return (
    <div style={{ marginTop: Spacing.md, padding: `0 ${Spacing.md}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Heading level={2}>♬ Playlists</Heading>
        <button onClick={handleShowAllClick} style={{ background: 'none', border: 'none', color: Colors.dark, fontSize: FontSizes.base, cursor: 'pointer' }}>Show all</button>
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

function ArtistItem({ artist, onClick }: { artist: Artist; onClick: (artist: Artist) => void }) {
  return (
    <button onClick={() => onClick(artist)} style={{ background: 'transparent', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
      <img src={artist.image} alt={`${artist.name} profile`} style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: Spacing.sm, objectFit: 'cover' }} />
      <span style={{ fontSize: FontSizes.sm, fontWeight: 600, maxWidth: '100px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{artist.name}</span>
    </button>
  );
}

export default Playlists;