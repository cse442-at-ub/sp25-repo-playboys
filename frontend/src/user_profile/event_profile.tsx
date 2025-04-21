import React, { useEffect, useRef, useState } from 'react';
import '../search_result_page/SearchResultPage.css';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Event {
  date: string;
  time: string;
  location: string;
  name: string;
  artist: string;
  image: string;
  id: string;
}

const MyEvent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchParams] = useSearchParams();
  const user = searchParams.get("user") || "";
  const [username, setUsername] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const itemWidth = 250;
  const scrollAmount = itemWidth * 0.8;

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/usernameGrabber.php`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.login_user) {
            setUsername(data.login_user);
          }
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/events/joinedEvents.php?user=${(user && user !== "null") ? user : ""}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'page-source': 'profile',
          },
        }); // Update with your real endpoint
        const result = await response.json();
        if (result.status == "success") {
          setEvents(result.data);
        } else {
          console.log('No events found for this user.');
          setEvents([]);
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchUsername();
    fetchEvents();
  }, [user]);

  const handleScrollRight = () => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (eventsContainerRef.current) {
      eventsContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const goToEvent = (id: string) => {
    navigate(`/event?id=${id}`);
  };

  return (
    <div> {/* Changed from a div with a specific class to a plain div */}
      <div className="d-flex justify-content-between align-items-center mb-3"> {/* Added header with button */}
        <h2 className="h3 fw-bold mb-0">
          {username === user || user === "" ? (
                    "My Events"
                  ) : (
                    `${user}'s Events`
          )}
        </h2> {/* Consistent title style can be applied in UserProfile if needed */}
        {username === user || user === "" ? (
          <a
            href="#/event-creation"
            className="btn btn-success rounded-circle d-flex justify-content-center align-items-center p-0"
            style={{ width: '32px', height: '32px', fontSize: '1.2em' }}
            aria-label="Create new event"
          >
            +
          </a>
        ): null}
      </div>
      <div
        className="event-search-results-compact"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {loading ? (
          <p className="loading-compact">Loading events...</p>
        ) : error ? (
          <p className="error-compact">{error}</p>
        ) : events.length > 0 ? (
          <>
            <div className="event-results-container-compact" ref={eventsContainerRef}>
              {events.map((event, index) => (
                <div key={index} className="event-item-compact" onClick={() => goToEvent(event.id)} style={{ cursor: 'pointer' }}>
                  <div className="event-image-compact">
                    <img src={event.image || './static/ProfilePlaceholder.png'} alt={event.name} />
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
    </div>
  );
};

export default MyEvent;