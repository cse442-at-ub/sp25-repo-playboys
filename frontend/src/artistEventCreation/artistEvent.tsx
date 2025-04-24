import React, { useState, useEffect } from "react";
 import { useSearchParams, useNavigate } from "react-router-dom";
 import "./artistEvent.css";

 interface Participant {
  username: string;
  image: string;
 }

 interface Event {
  title: string;
  location: string;
  description: string;
  image: string;
  creator: string;
  date: string; // Added the date field
  time: string;
  participants: Participant[];
 }

 const EventDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [joinStatus, setJoinStatus] = useState<string>("not_joined"); // Tracks the join status
  const [joinMessage, setJoinMessage] = useState<string>("");
  const navigate = useNavigate();

  const goToProfile = (Name: string) => {
   // Redirect to the friend's profile page
   navigate(`/userprofile?user=${Name || ""}`);
  };

  const handleBackButton = () => {
   navigate(-1); // Go back to the previous page
  };

  // Fetch event details on page load
  useEffect(() => {
   const fetchLoginUser = async () => {
    try {
     const response = await fetch(
      `${process.env.REACT_APP_API_URL}backend/usernameGrabber.php`,{
       credentials: "include",
      }
     );
     const result = await response.json();
     if (response.ok) {
      setLoggedInUser(result.login_user);
     } else {
      console.error("Login check failed:");

     }
    }
    catch (error) {
     console.error("Error checking login status:", error);

    }
   };
   const fetchEventDetails = async () => {
    try {
     const response = await fetch(
      `${process.env.REACT_APP_API_URL}backend/events/event.php?id=${eventId}`,{
       credentials: "include",
      }
     );
     const result = await response.json();
     if (result.status === "success") {
      setEvent(result.event);
     } else {
      console.error("Event details fetch failed:", result.message);
     }
    } catch (error) {
     console.error("Error fetching event details:", error);
    }
   };

   const checkJoinStatus = async () => {
    try {
     const response = await fetch(
      `${process.env.REACT_APP_API_URL}backend/events/joinEventChecker.php`,
      {
       credentials: "include",
       method: "POST",
       headers: {
        "Content-Type": "application/json",
       },
       body: JSON.stringify({ eventId }),
      }
     );
     const result = await response.json();
     if (result.status === "joined") {
      setJoinStatus("joined");
     } else if(result.status === "creator") {
      setJoinStatus("creator");
     } else {
      setJoinStatus("not_joined");
     }
    } catch (error) {
     console.error("Error checking join status:", error);
    }
   };
   fetchLoginUser();
   fetchEventDetails();
   checkJoinStatus(); // Check if the user has already joined the event
  }, [eventId]);

  const handleJoinEvent = async () => {
   try {
    const response = await fetch(
     `${process.env.REACT_APP_API_URL}backend/events/joinEvent.php`,
     {
      credentials: "include",
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
     }
    );
    const result = await response.json();
    if (result.status === "success") {
     setJoinStatus("joined");
     setJoinMessage("Successfully joined the event!");
     setEvent((prevEvent) =>
      prevEvent
       ? {
          ...prevEvent,
          participants: [...prevEvent.participants, result.newParticipant],
         }
       : null
     );
    } else {
     setJoinMessage("Failed to join the event. Please try again.");
    }
   } catch (error) {
    console.error("Error joining the event:", error);
    setJoinMessage("An error occurred while trying to join the event.");
   }
  };

  const handleLeaveEvent = async () => {
   try {
    const response = await fetch(
     `${process.env.REACT_APP_API_URL}backend/events/leaveEvent.php`,
     {
      credentials: "include",
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
     }
    );
    const result = await response.json();
    if (result.status === "success") {
     setJoinStatus("not_joined");
     setJoinMessage("Successfully left the event.");
     setEvent((prevEvent) =>
      prevEvent
       ? {
          ...prevEvent,
          participants: prevEvent.participants.filter(
           (p) => p.username !== loggedInUser
          ),
         }
       : null
     );
    } else {
     setJoinMessage("Failed to leave the event. Please try again.");
    }
   } catch (error) {
    console.error("Error leaving the event:", error);
    setJoinMessage("An error occurred while trying to leave the event.");
   }
  };

  const handleDeleteEvent = async () => {
   try {
    const response = await fetch(
     `${process.env.REACT_APP_API_URL}backend/events/deleteMyEvent.php`,
     {
      credentials: "include",
      method: "POST",
      headers: {
       "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventId }),
     }
    );
    const result = await response.json();
    if (result.status === "success") {
     navigate(-1); // Go back to the previous page after successful deletion
    } else {
     alert("Failed to delete the event. Please try again.");
    }
   } catch (error) {
    console.error("Error deleting the event:", error);
    alert("An error occurred while trying to delete the event.");
   }
  };

  if (!event) {
   return <div>Loading...</div>;
  }

  return (
   <div className="event-details-page-wrapper">
    <div className="event-details-container">
     <div className="event-details-header">
      <button
       className="event-details-back-button"
       aria-label="Go back"
       onClick={handleBackButton}
      >
       ←
      </button>
      <h1 className="event-details-title">{event.title}</h1>
     </div>

     <div className="event-details-body">
      <div className="event-image-container">
       <img src={event.image} alt="Event" className="event-image" />
      </div>

      <div className="event-info">
       <p><strong>Location:</strong> {event.location}</p>
       <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
       <p><strong>Time:</strong> {event.time}</p>
       <p><strong>Creator:</strong> {event.creator}</p>
      </div>

      {/* Description Section */}
      <h3 className="event-section-title">Description</h3> {/* Title outside the box */}
      <div className="event-description-box">
       <p>{event.description}</p>
      </div>

      {/* Participants Section */}
      <h3 className="event-section-title">Participants</h3> {/* Title outside the box */}
      <div className="event-participants-box">
       {event.participants.length > 0 ? (
        <ul className="participant-list">
         {event.participants.map((participant) => (
          <li key={participant.username} className="participant-item">
           <div onClick={() => goToProfile(participant.username)} style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }}>
            <img
             src={participant.image || "./static/ProfilePlaceholder.png"}
             alt={participant.username}
             className="participant-image"
             onError={(e) => (e.currentTarget.src = "./static/ProfilePlaceholder.png")}
            />
            <span className="participant-username">{participant.username}</span>
           </div>
          </li>
         ))}
        </ul>
       ) : (
        <p>Be the first to participate!</p>
       )}
      </div>

      {joinStatus === "creator" ? (
        <button
            onClick={handleDeleteEvent}
            className="join-event-button button-delete" // Added button-delete class
        >
            Delete Event
        </button>
        ) : (
        <button
            onClick={joinStatus === "joined" ? handleLeaveEvent : handleJoinEvent}
            className={`join-event-button ${
            joinStatus === "joined" ? "button-joined" : ""
            }`}
        >
            {joinStatus === "joined" ? "Leave Event" : "Join Event"}
        </button>
        )}
      {joinMessage && <p className="join-message">{joinMessage}</p>}
     </div>
    </div>
   </div>
  );
 };

 export default EventDetails;