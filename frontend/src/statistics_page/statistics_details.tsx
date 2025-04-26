import React, { useState, useEffect } from 'react';
import './statistic_details.css';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useCSRFToken } from "../csrfContent";

type TimeRange = 'short_term' | 'medium_term' | 'long_term';
type ItemType = 'artists' | 'tracks';
type Limit = 1 | 3 | 5 | 10 | 15 | 20 | 25 | 50 | 100;

interface ListeningItem {
    rank: number;
    name: string;
    image: string;
    popularity: number;
}

const StatisticsDetails: React.FC = () => {
    const [displayData, setDisplayData] = useState<ListeningItem[]>([]);

    const navigate = useNavigate();
    const { csrfToken } = useCSRFToken();
    const [topX, setTopX] = useState<Limit>(50);
    const [loading, setLoading] = useState<boolean>(true);
    const [userType, setUserType] = useState<"spotify" | "nonspotify" | null>(null);

    const location = useLocation();
    const initialType = location.state?.type ?? "artists";
    const initialTimeRange = location.state?.timeRange ?? "medium_term";

    const [itemType, setItemType] = useState<ItemType>(initialType);
    const [timeRange, setTimeRange] = useState<TimeRange>(initialTimeRange);

    const getDisplayData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/userTop50X.php?type=${itemType}&time_range=${timeRange}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken
                }
            });

            if (response.ok) {
                const text = await response.text();
                const data = JSON.parse(text);
                console.log("Total items returned by Spotify:", data.length);
                setDisplayData(data);
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDisplayData();
    }, [itemType, timeRange, topX]);

    const handleClickBack = () => {
        navigate("/statistics");
    };

    useEffect(() => {
        const checkUserType = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}backend/getLoginType.php`, {
                    credentials: "include",
                });
                const data = await res.json();
                setUserType(data.status === "success" && data.is_spotify_user ? "spotify" : "nonspotify");
            } catch (error) {
                console.error("Error checking user type:", error);
                setUserType("nonspotify");
            }
        };
        checkUserType();
    }, []);

    if (userType === "nonspotify") {
        return (
            <div className="statistics-container">
                <button className="back-button" onClick={() => navigate("/explore")}>←</button>
                <div className="statistics-content">
                    <h2>You must log in with Spotify to use this feature.</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="statistics-container">
            <header className="statistics-header">
                <button onClick={handleClickBack} className="back-button">←</button>
                <h1 className="statistics-title centered-title">Statistics</h1>
            </header>


            {loading ? (
                <div className="statistics-content">
                    <p>Loading...</p>
                </div>
            ) : (
                <div className="detailed-leaderboard">
                    <div style={{ textAlign: "center", marginBottom: "12px" }}>
                        <div style={{ fontWeight: 600, fontSize: "18px", marginBottom: "4px" }}>
                            Top {displayData.length} {itemType === "artists" ? "Artists" : "Songs"} - {timeRange === "short_term" ? "Last Month" : timeRange === "medium_term" ? "Last 90 Days" : "Last Year"}
                        </div>
                            <select
                                className="statistics-select"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                            >
                                <option value="short_term">Last Month</option>
                                <option value="medium_term">Last 90 Days</option>
                                <option value="long_term">Last Year</option>
                            </select>
                        </div>

                    <div className="detailed-grid">
                        {displayData.map((item) => (
                            <div key={item.rank} className="detailed-item">
                                <span className="detailed-item-rank">{item.rank}</span>
                                <div className="detailed-item-image-container">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="detailed-item-image" />
                                    ) : (
                                        <div className="detailed-item-image-placeholder">
                                            <span>No image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="detailed-item-details">
                                    <div className="detailed-item-name">{item.name}</div>
                                    <div className="detailed-item-stats">
                                        Popularity Score: {item.popularity}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatisticsDetails;