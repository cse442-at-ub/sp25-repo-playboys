import React, { useState, useRef } from 'react';
import './SearchResultPage.css';

const EventResults = () => {
    const [events, setEvents] = useState(generateRandomEvents(10)); //should get information from backend instead of randomly generation
    const eventsContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    interface Event {
        date: string;
        time: string;
        location: string;
        name: string;
        artist: string;
        image: string;
    }

    function generateRandomEvents(count: number): Event[] {
        const events: Event[] = [];
        for (let i = 0; i < count; i++) {
            events.push({
                date: getRandomDate(),
                time: getRandomTime(),
                location: getRandomLocation(),
                name: getRandomEventName(),
                artist: getRandomArtist(), // Added artist
                image: './static/TheBeatlespfp.png'
            });
        }
        return events;
    }

    // all these function generate randomly data, should fetch from backend to get all these data (could just be one fetch and receive a json with all information)
    function getRandomDate() {
        const start = new Date(2023, 0, 1);
        const end = new Date(2024, 11, 31);
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toLocaleDateString();
    }

    function getRandomTime() {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    function getRandomLocation() {
        const locations = ['Metlife Stadium', 'Madison Square Garden', 'Staples Center', 'The O2 Arena', 'Wembley Stadium'];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    function getRandomEventName() {
        const eventNames = ['Concert', 'Sports Game', 'Festival', 'Show', 'Exhibition'];
        return eventNames[Math.floor(Math.random() * eventNames.length)];
    }

    function getRandomArtist() { // Added function for random artist
        const artists = ['Drake', 'Taylor Swift', 'The Weeknd', 'Beyoncé', 'Ed Sheeran'];
        return artists[Math.floor(Math.random() * artists.length)];
    }

    const handleScrollRight = () => {
        if (eventsContainerRef.current) {
            const itemWidth = 350; // Adjust based on your item width + margin
            eventsContainerRef.current.scrollBy({ left: itemWidth, behavior: 'smooth' });
        }
    };

    const handleScrollLeft = () => {
        if (eventsContainerRef.current) {
            const itemWidth = 350; // Adjust based on your item width + margin
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
                                    <div className="event-artist">{event.artist}</div> {/* Added artist */}
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