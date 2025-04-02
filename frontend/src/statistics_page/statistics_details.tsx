import React, { useState } from 'react';
import './statistics.css';
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from "../csrfContent";

type TimeRange = 'Last Month' | 'Last 90 Days' | 'Last Year';
type ItemType = 'Top Artists' | 'Top Songs';
type Limit = 1 | 3 | 5 | 10 | 15 | 20 | 25 | 50 | 100;

const COLORS = [ '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FFC5C5', '#FF7700', '#5F4B8B', '#F15BB5', '#00BBF9', '#00F5D4' ];

interface ListeningItem
{
    id: number;
    rank: number;
    name: string;
    image: string;
    popularity: number;
}

const StatisticsDetails: React.FC = ( props ) => 
{
    const [displayData, setDisplayData] = useState< ListeningItem[] >( [] );

    const navigate = useNavigate();
    const { csrfToken } = useCSRFToken();

    const [ itemType, setItemType ] = useState< ItemType >( 'Top Artists' );
    const [ timeRange, setTimeRange ] = useState< TimeRange >( 'Last Month' );
    const [ topX, setTopX ] = useState< Limit >( 10 );
  
    const getDisplayData = async () => 
    {
        const data_to_request = { type: itemType, time_range: timeRange, limit: topX };

        try 
        {
            console.log( "fetching userTopXYZ..." );
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTopXYZ.php`, 
            {
                credentials: "include",
                method: "POST",
                headers: {                     
                    'Content-Type': 'application/json', 
                    'CSRF-Token': csrfToken 
                },
                body: JSON.stringify( data_to_request )
            });
            console.log( "fetched userTopXYZ..." );

            if ( response.ok ) 
            {
                try {
                    console.log( "response is okay..." );
                    const data = await response.json();
                    console.log( data );
                    
                    console.log( "setting displayData..." );
                    setDisplayData( data );
                }
                catch ( error ) 
                {
                    console.error( "Not logged into Spotify" );
                }
            } 
            else 
            {
                console.error( 'Error fetching top ' + itemType + ': ', response.statusText );
            }
        } 
        catch ( error ) 
        {
            console.error( 'Error fetching top ' + itemType + ': ', error );
        }
    };
    
    getDisplayData();
    const topItem = displayData.length > 0 ? displayData[0] : null

    const handleClickBack = () => 
    {
        navigate( "/statistics" );
    };
    
    return (
        <div className="statistics-container">
            <header className="statistics-header">
                <h1 className="statistics-title">Statistics</h1>
                
                <div className="statistics-filters">
                    <select 
                        className="statistics-select"
                        value={ timeRange }
                        onChange={ ( e ) => setTimeRange( e.target.value as TimeRange ) }
                    >
                        <option value="Last Month">Last Month</option>
                        <option value="Last 90 Days">Last 90 Days</option>
                        <option value="Last Year">Last Year</option>
                    </select>
                    
                    <select 
                        className="statistics-select"
                        value={ itemType }
                        onChange={ ( e ) => setItemType( e.target.value as ItemType ) }
                    >
                        <option value="Top Artists">Top Artists</option>
                        <option value="Top Songs">Top Songs</option>
                    </select>
                </div>
            </header>
            
            <div className="detailed-leaderboard">
                <h2 className="detailed-leaderboard-title"> Top { topX } { itemType } - { timeRange } </h2>
                
                <div className="detailed-grid">
                    { displayData.map( ( item ) => (
                        <div key={item.id} className="detailed-item">
                            <span className="detailed-item-rank">{ item.rank }</span>
                            
                            <div className="detailed-item-image-container">
                                { item.image ? (
                                <img 
                                    src={ item.image } 
                                    alt={ item.name } 
                                    className="detailed-item-image"
                                />
                                ) : (
                                <div className="detailed-item-image-placeholder">
                                    <span>No image</span>
                                </div>
                                )}
                            </div>
                            
                            <div className="detailed-item-details">
                                <div className="detailed-item-name">{ item.name }</div>
                                <div className="detailed-item-stats">
                                { item.popularity } plays · { item.popularity.toFixed( 1 ) }%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="back-button-container">
                <button onClick={ handleClickBack } className="back-button" > Back </button>
            </div>
        </div>
    );
};

export default StatisticsDetails;