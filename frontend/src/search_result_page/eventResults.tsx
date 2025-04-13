import React, { useRef, useState } from 'react';
import './SearchResultPage.css';

interface Event {
    date: string;
    time: string;
    location: string;
    name: string;
    artist: string;
    image: string;
}

const EventResults = ({ data }: { data : Event[] }) => {
    const events: Event[] = data;
    const eventsContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleScrollRight = () => {
        if (eventsContainerRef.current) {
            const itemWidth = 350;
            eventsContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (eventsContainerRef.current) {
            const itemWidth = 350;
            eventsContainerRef.current.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="event-search-results"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className="event-search-results-title">Event Search Results</h2>
            {events.length > 0 ? (
                <>
                    <div className="event-results-container" ref={eventsContainerRef}>
                        {events.map((event, index) => (
                            <div key={index} className="event-item">
                                <div className="event-details">
                                    <div className="event-date">{event.date}</div>
                                    <div className="event-time">{event.time}</div>
                                    <div className="event-location">{event.location}</div>
                                    <div className="event-artist">{event.artist}</div>
                                </div>
                                <div className="event-image">
                                    <img src={event.image} alt={event.name} />
                                </div>
                            </div>
                        ))}
                    </div>
                    {isHovered && (
                        <>
                            <div className="scroll-arrow left" onClick={handleScrollLeft}>
                                ←
                            </div>
                            <div className="scroll-arrow right" onClick={handleScrollRight}>
                                →
                            </div>
                        </>
                    )}
                </>
            ) : (
                <p>No events found.</p>
            )}
        </div>
    );
};

export default EventResults;
