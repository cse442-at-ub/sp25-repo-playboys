import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./makeEvent.css";

interface EventForm {
  image: File | null;
  title: string;
  location: string;
  date: string;
  time: string; // Exact time selection
  description: string;
}

const CreateEvent: React.FC = () => {
  const [formData, setFormData] = useState<EventForm>({
    image: null,
    title: "",
    location: "",
    date: "",
    time: "00:00", // Default time
    description: "",
  });

  const [preview, setPreview] = useState<string>("./static/LandingPageWallpaper.png"); // Default image path
  const [error, setError] = useState<string>("");
  const navigate = useNavigate(); // useNavigate hook for redirection
  // Scroll to the top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      // If no file is selected, revert to the default placeholder
      setPreview("./static/eventPlaceholder.png");
      setFormData((prev) => ({ ...prev, image: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state before submission

    // Step 1: Upload image if a new one is selected
    let uploadedImageName = "";

    if (formData.image) {
      const imageFormData = new FormData();
      imageFormData.append("file", formData.image);

      try {
        const uploadResponse = await fetch(
          `${process.env.REACT_APP_API_URL}backend/events/eventImageUpload.php`,
          {
            method: "POST",
            body: imageFormData,
            credentials: "include",
          }
        );

        const uploadResult = await uploadResponse.json();

        if (uploadResult.status === "success") {
          uploadedImageName = uploadResult.fileName;
        } else {
          console.error("Image upload failed:", uploadResult.message);
          setError("Image upload failed.");
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        setError("Image upload error.");
        return;
      }
    } else {
      // If no new image is uploaded, we'll use a default name on the backend
      uploadedImageName = "./backend/eventImages/default_event.png";
    }

    // Step 2: Send event data to backend
    const payload = {
      title: formData.title,
      location: formData.location,
      date: formData.date,
      time: formData.time, // Include the time in the payload
      description: formData.description,
      image: uploadedImageName, // Send the determined image name
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}backend/events/artistEventCreation.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        navigate("/explore"); // Use navigate for redirection
      } else {
        console.error("Event creation failed:", result.message);
        setError(result.message || "Event creation failed."); // Use the backend message if available
      }
    } catch (error) {
      console.error("Event submission error:", error);
      setError("Failed to create event.");
    }
  };

  const handleBackButton = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="event-creation-page-wrapper">
      <div className="event-creation-container">
        <div className="event-creation-header">
          <button
            className="event-creation-back-button"
            aria-label="Go back"
            onClick={handleBackButton}
          >
            ←
          </button>
          <h1 className="event-creation-title">Create Event</h1>
        </div>
        <form className="event-creation-form" onSubmit={handleSubmit}>
          <div className="event-image-upload-section">
            <img
              src={preview}
              alt="Event Preview"
              className="event-creation-preview-image"
              onError={(e) => (e.currentTarget.src = "./static/LandingPageWallpaper.png")}
            />
            <label className="event-creation-label" htmlFor="image">
              Browse Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="event-creation-input event-creation-file-input"
            />
          </div>

          <div>
            <label className="event-creation-label" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="event-creation-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="event-creation-label" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="event-creation-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="event-creation-label" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="event-creation-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="event-creation-label" htmlFor="time">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className="event-creation-input"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="event-creation-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="event-creation-textarea"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>} {/* Error message display */}

          <button type="submit" className="event-creation-button">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;