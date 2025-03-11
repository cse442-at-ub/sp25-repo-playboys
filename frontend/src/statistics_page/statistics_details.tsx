import React, { useState } from 'react';
import './statistics.css';

import {TimeFrame, ContentType, ListeningItem, StatisticsProps, COLORS } from './statistics_interfaces';

export const StatisticsDetails: React.FC< StatisticsProps > = ( props ) => 
{
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('Last Month');
    const [contentType, setContentType] = useState<ContentType>('Top Artists');
    
    // Determine which data to display based on filters
    const getDisplayData = (): ListeningItem[] => 
    {
        if (contentType === 'Top Artists') 
        {
            if (timeFrame === 'Last Month') return props.topArtistsLastMonth;
            if (timeFrame === 'Last 90 Days') return props.topArtistsLast90Days;
            return props.topArtistsLastYear;
        } 
        else if (contentType === 'Top Songs') 
        {
            if (timeFrame === 'Last Month') return props.topSongsLastMonth;
            if (timeFrame === 'Last 90 Days') return props.topSongsLast90Days;
            return props.topSongsLastYear;
        } 
        else 
        {
            if (timeFrame === 'Last Month') return props.topAlbumsLastMonth;
            if (timeFrame === 'Last 90 Days') return props.topAlbumsLast90Days;
            return props.topAlbumsLastYear;
        }
    };
    
    const displayData = getDisplayData();

    const handleClickBack = () => 
    {
        window.location.href = "#/statistics";
    };
    
    return (
        <div className="statistics-container">
            <header className="statistics-header">
                <h1 className="statistics-title">Statistics</h1>
                
                <div className="statistics-filters">
                    <select 
                        className="statistics-select"
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
                    >
                        <option value="Last Month">Last Month</option>
                        <option value="Last 90 Days">Last 90 Days</option>
                        <option value="Last Year">Last Year</option>
                    </select>
                    
                    <select 
                        className="statistics-select"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value as ContentType)}
                    >
                        <option value="Top Artists">Top Artists</option>
                        <option value="Top Songs">Top Songs</option>
                        <option value="Top Albums">Top Albums</option>
                    </select>
                </div>
            </header>
            
            <div className="detailed-leaderboard">
                <h2 className="detailed-leaderboard-title"> {contentType} - {timeFrame} </h2>
                
                <div className="detailed-grid">
                    { displayData.map( ( item ) => (
                        <div key={item.id} className="detailed-item">
                            <span className="detailed-item-rank">{item.rank}</span>
                            
                            <div className="detailed-item-image-container">
                                { item.imageUrl ? (
                                <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="detailed-item-image"
                                />
                                ) : (
                                <div className="detailed-item-image-placeholder">
                                    <span>No image</span>
                                </div>
                                )}
                            </div>
                            
                            <div className="detailed-item-details">
                                <div className="detailed-item-name">{item.name}</div>
                                <div className="detailed-item-stats">
                                {item.playCount} plays · {item.playTimePercentage.toFixed(1)}%
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