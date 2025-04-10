import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import "./artistEvent.css";

interface Participant {
  id: number;
  name: string;
}

interface Event {
  title: string;
  location: string;
  description: string;
  image: string;
  creator: string;
  date: string; // Added the date field
  participants: Participant[];
}

const EventDetails: React.FC = () => {
    const [searchParams] = useSearchParams();
    const eventId = searchParams.get("id");
    const [event, setEvent] = useState<Event | null>(null);

  // Fetch event details by eventId (you can replace this URL with your actual backend endpoint)
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}backend/events/event.php?id=${eventId}`
        );
        const result = await response.json();
        if (result.status === "success") {
          setEvent(result.event); // Assuming the response contains the event data
        } else {
          console.error("Event details fetch failed:", result.message);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="event-details-wrapper">
      <div className="event-container">
        <h1 className="event-title">{event.title}</h1>
        
        {/* Event Image */}
        <div className="event-image-container">
          <img
            src={event.image}
            alt="Event"
            className="event-image"
          />
        </div>

        {/* Event Information */}
        <div className="event-info">
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Creator:</strong> {event.creator}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p> {/* Added date display */}
          <p><strong>Description:</strong> {event.description}</p>
        </div>

        {/* Participants */}
        <div className="event-participants">
          <h3>Participants</h3>
          {event.participants.length > 0 ? (
            <ul>
              {event.participants.map((participant) => (
                <li key={participant.id}>{participant.name}</li>
              ))}
            </ul>
          ) : (
            <p>Be the first to participate!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

