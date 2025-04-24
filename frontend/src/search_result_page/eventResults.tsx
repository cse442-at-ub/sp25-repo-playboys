import React, { useRef, useState } from 'react';
import './SearchResultPage.css';
import { useNavigate } from 'react-router-dom';

interface Event {
    date: string;
    time: string;
    location: string;
    name: string;
    artist: string;
    image: string;
    id: string;
}

const EventResults = ({ data }: { data : Event[] }) => {
    const events: Event[] = data;
    const eventsContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const itemWidth = 250; // Smaller item width
    const scrollAmount = itemWidth * 0.8; // Scroll by a fraction of the item width

    const handleScrollRight = () => {
        if (eventsContainerRef.current) {
            eventsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const goToEvent = (id: string) => {
        navigate(`/event?id=${id || ""}`);
    };

    const handleScrollLeft = () => {
        if (eventsContainerRef.current) {
            eventsContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div
            className="event-search-results-compact"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <h2 className="event-search-results-title-compact">Events</h2>
            {events.length > 0 ? (
                <>
                    <div className="event-results-container-compact" ref={eventsContainerRef}>
                        {events.map((event, index) => (
                            <div key={index} className="event-item-compact" onClick={() => goToEvent(event.id)} style={{cursor: "pointer"}}>
                                <div className="event-image-compact">
                                    <img src={event.image || "./static/ProfilePlaceholder.png"} alt={event.name} />
                                </div>
                                <div className="event-info-compact">
                                    <div className="event-name-compact">{event.name}</div>
                                    <div className="event-details-compact">
                                        <span className="event-date-compact">{event.date}</span>
                                        <span className="event-time-compact">{event.time}</span>
                                    </div>
                                    <div className="event-location-compact">{event.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isHovered && (
                        <>
                            <div className="scroll-arrow-compact left-compact" onClick={handleScrollLeft}>
                                ←
                            </div>
                            <div className="scroll-arrow-compact right-compact" onClick={handleScrollRight}>
                                →
                            </div>
                        </>
                    )}
                </>
            ) : (
                <p className="no-events-compact">No events found.</p>
            )}
        </div>
    );
};

export default EventResults;