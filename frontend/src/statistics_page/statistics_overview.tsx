import React, { useState } from 'react';
import './statistics.css';

import {TimeFrame, ContentType, ListeningItem, StatisticsProps, COLORS } from './statistics_interfaces';

export const StatisticsOverview: React.FC< StatisticsProps > = ( props ) => 
{
    const [ timeFrame, setTimeFrame ] = useState< TimeFrame >( 'Last Month' );
    const [ contentType, setContentType ] = useState< ContentType >( 'Top Artists' );
  
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
    const topItem = displayData.length > 0 ? displayData[0] : null;
  
    // Navigating to Details page...
    const handleClickDetails = () => 
    {
        window.location.href = "#/statistics/details";
    };
  
    return (
        <div className="statistics-container">
            <header className="statistics-header">
                <h1 className="statistics-title">Statistics</h1>
                
                <div className="statistics-filters">
                    <select 
                        className="statistics-select"
                        value={ timeFrame }
                        onChange={ ( e ) => setTimeFrame( e.target.value as TimeFrame ) }
                    >
                            <option value="Last Month">Last Month</option>
                            <option value="Last 90 Days">Last 90 Days</option>
                            <option value="Last Year">Last Year</option>
                    </select>
                    
                    <select 
                        className="statistics-select"
                        value={ contentType }
                        onChange={ ( e ) => setContentType( e.target.value as ContentType ) }
                    >
                            <option value="Top Artists">Top Artists</option>
                            <option value="Top Songs">Top Songs</option>
                            <option value="Top Albums">Top Albums</option>
                    </select>
                </div>
            </header>
          
            <div className="statistics-content">
                <div className="statistics-graphic-container">
                    <div className="statistics-circle-graphic">
                        <svg viewBox="0 0 100 100" className="statistics-svg">
                            {displayData.slice(0, props.topX).map( ( item, index ) => {
                                const totalPercentage = displayData
                                .slice(0, props.topX)
                                .reduce((sum, curr) => sum + curr.playTimePercentage, 0);
                                
                                const normalizedPercentage = (item.playTimePercentage / totalPercentage) * 100;
                                const startAngle = displayData
                                .slice(0, index)
                                .reduce((sum, curr) => sum + ((curr.playTimePercentage / totalPercentage) * 360), 0);
                                
                                const endAngle = startAngle + (normalizedPercentage * 3.6); // 3.6 = 360/100
                                
                                // Convert to SVG arc path
                                const startX = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                                const startY = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                                const endX = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                                const endY = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                                
                                const largeArcFlag = normalizedPercentage > 50 ? 1 : 0;
                                
                                return (
                                    <path 
                                        key={item.id}
                                        d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                );
                            })}
                        
                        <circle cx="50" cy="50" r="30" fill="white" />
                        
                        {topItem && (
                            <foreignObject x="20" y="20" width="60" height="60">
                            <div className="circle-center-content">
                                <div className="circle-rank">#1</div>
                                <div className="circle-name">
                                {topItem.name}
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
                        { contentType } - { timeFrame }
                        </h2>
                        
                        <div className="leaderboard-items">
                            {displayData.slice(0, props.topX).map((item) => (
                                <div key={item.id} className="leaderboard-item">
                                <span className="item-rank">{item.rank}</span>
                                
                                <div className="item-image-container">
                                    {item.imageUrl ? (
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.name} 
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
                                    {Math.floor(item.playTimeMinutes / 60)} hrs {item.playTimeMinutes % 60} mins
                                    </div>
                                </div>
                                
                                <div className="item-stats">
                                    <div className="item-play-count">{item.playCount >= 0? item.playCount : "%"}</div>
                                    <div className="item-percentage">{item.playTimePercentage.toFixed(1)}%</div>
                                </div>
                                </div>
                            ))}
                        </div>
                        
                        <button onClick={ handleClickDetails } className="details-button" > Details </button>
                    </div>
                </div>
            </div>
        </div>
    );
};