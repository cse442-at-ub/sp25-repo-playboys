import React, { useState, useEffect } from 'react';
import './statistics.css';
import { useNavigate } from "react-router-dom";
import { useCSRFToken } from "../csrfContent";

type TimeFrame = "short_term" | "medium_term" | "long_term";
type ItemType = "artists" | "tracks";

const COLORS = [ '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',  '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FFC5C5', '#FF7700', '#5F4B8B', '#F15BB5', '#00BBF9', '#00F5D4' ];

interface ListeningItem
{
    rank: number;
    name: string;
    image: string;
    popularity: number;
}

const StatisticsOverview: React.FC = ( props ) => 
{
    const [displayData, setDisplayData] = useState< ListeningItem[] >( [] );

    const navigate = useNavigate();
    const { csrfToken } = useCSRFToken();

    const [ itemType, setItemType ] = useState< ItemType >( "artists" );
    const [ timeRange, setTimeRange ] = useState< TimeFrame >( "medium_term" );
    const [ topX, setTopX ] = useState< number >( 10 );
    const [loading, setLoading] = useState<boolean>(true);
  
    const getDisplayData = async () => 
    {
        setLoading( true );

        try 
        {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTop50X.php?type=${itemType}&time_range=${timeRange}`, {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json", 
                    "CSRF-Token": csrfToken 
                }
            });

            console.log( `fetched backend/userTop100Xlocal.php?type=${itemType}&time_range=${timeRange}` );

            if ( response.ok )
            {
                try 
                {
                    console.log( "response is okay..." );
                    const text = await response.text();
                    console.log("text: " + text);
                    const data = JSON.parse( text )
                    console.log( "data: " + data );
                    
                    console.log( "displaying data..." );
                    setDisplayData( data );
                }
                catch ( error )
                {
                    console.error( error );
                }
            }
            else
            {
                console.error( `error: response not ok: error fetching backend/userTop100Xlocal.php?type=${itemType}&time_range=${timeRange}` );
            }
        }
        catch ( error ) 
        {
            console.error( `error: error caught fetching backend/userTop100Xlocal.php?type=${itemType}&time_range=${timeRange}\n\n` + error );
        }
        finally 
        {
            setLoading( false )
        }
    };    

    useEffect(() => {
        getDisplayData();
    }, [ itemType, timeRange, topX ]);

    const topItem = displayData.length > 0 ? displayData[0] : null
  
    // Navigating to Landing page...
    const handleClickBack = () => 
    {
        navigate("/");
    };
    
    // Navigating to Details page...
    const handleClickDetails = () => 
    {
        navigate("/statistics/details");
    };
  
    return (
        <div className="statistics-container">
            <header className="statistics-header">
                <button onClick={ handleClickBack } className="statistics-title" >« </button>
                <h1 className="statistics-title">Statistics</h1>
                
                <div className="statistics-filters">
                    <select 
                        className="statistics-select"
                        value={ timeRange }
                        onChange={ ( e ) => setTimeRange( e.target.value as TimeFrame ) }
                    >
                            <option value="short_term">Last Month</option>
                            <option value="medium_term">Last 90 Days</option>
                            <option value="long_term">Last Year</option>
                    </select>
                    
                    <select 
                        className="statistics-select"
                        value={ itemType }
                        onChange={ ( e ) => setItemType( e.target.value as ItemType ) }
                    >
                            <option value="artists">Top Artists</option>
                            <option value="tracks">Top Songs</option>
                    </select>
                </div>
            </header>
        
            { loading ? ( 
                <div className="statistics-content">
                    <p>Loading...</p> 
                </div>
            ) : (
            <>
                <div className="statistics-content">
                    <div className="statistics-graphic-container">
                        <div className="statistics-circle-graphic">
                            <svg viewBox="0 0 100 100" className="statistics-svg">
                                {displayData.slice(0, topX).map( ( item, index ) => {
                                    const totalPercentage = displayData
                                    .slice( 0, topX )
                                    .reduce( ( sum, curr ) => sum + 1, 0 );
                                    
                                    const normalizedPercentage = ( 1 / totalPercentage ) * 100;
                                    const startAngle = displayData
                                    .slice( 0, index )
                                    .reduce( ( sum, curr ) => sum + ( ( 1 / totalPercentage ) * 360 ), 0 );
                                    
                                    const endAngle = startAngle + ( normalizedPercentage * 3.6 ); // 3.6 = 360/100
                                    
                                    // Convert to SVG arc path
                                    const startX = 50 + 40 * Math.cos( ( startAngle - 90 ) * Math.PI / 180 );
                                    const startY = 50 + 40 * Math.sin( ( startAngle - 90 ) * Math.PI / 180 );
                                    const endX = 50 + 40 * Math.cos( ( endAngle - 90 ) * Math.PI / 180 );
                                    const endY = 50 + 40 * Math.sin( ( endAngle - 90 ) * Math.PI / 180 );
                                    
                                    const largeArcFlag = normalizedPercentage > 50 ? 1 : 0;
                                    
                                    return (
                                        <path 
                                            key={ item.rank }
                                            d={ `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z` }
                                            fill={ COLORS[ index % COLORS.length ] }
                                        />
                                    );
                                })}
                            
                            <circle cx="50" cy="50" r="30" fill="white" />
                            
                            { topItem && (
                                <foreignObject x="20" y="20" width="60" height="60">
                                <div className="circle-center-content">
                                    <div className="circle-rank">#1</div>
                                    <div className="circle-name">
                                    { topItem.name }
                                    </div>
                                </div>
                                </foreignObject>
                            )}
                            </svg>
                        </div>
                    </div>
                    
                    <div className="statistics-leaderboard-container">
                        <div className="statistics-leaderboard">
                            <h2 className="leaderboard-title">
                            Top { topX } { itemType === "artists"? "Artists" : "Songs" } - { timeRange === "short_term"? "Last Month" : timeRange === "medium_term"? "Last 90 Days" : "Last Year" }
                            </h2>
                            
                            <div className="leaderboard-items">
                                { displayData.slice( 0, topX ).map( ( item ) => (
                                    <div key={ item.rank } className="leaderboard-item">
                                    <span className="item-rank">{ item.rank }</span>
                                    
                                    <div className="item-image-container">
                                        { item.image ? (
                                        <img 
                                            src={ item.image } 
                                            alt={ item.name } 
                                            className="item-image"
                                        />
                                        ) : (
                                        <div className="item-image-placeholder">
                                            <span>No image</span>
                                        </div>
                                        )}
                                    </div>
                                    
                                    <div className="item-details">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-time">
                                        { Math.floor( item.popularity / 60)} hrs { item.popularity % 60 } mins
                                        </div>
                                    </div>
                                    
                                    <div className="item-stats">
                                        <div className="item-play-count">{ item.popularity >= 0? item.popularity : "%" }</div>
                                        <div className="item-percentage">{ item.popularity.toFixed( 1 ) }%</div>
                                    </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button onClick={ handleClickDetails } className="details-button" > Details </button>
                        </div>
                    </div>
                </div>
            </> 
            )}
        </div>
    );
};

export default StatisticsOverview;