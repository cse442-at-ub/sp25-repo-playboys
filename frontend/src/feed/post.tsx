import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";

const PostPage = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [media, setMedia] = useState<string>("");
    const [song, setSong] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if all fields are filled
        if (!title || !description || !media || !song) {
            alert("Please fill in all fields!");
            return;
        }

        setIsSubmitting(true);

        // Simulate an API call or post submission (e.g., saving data to a server)
        setTimeout(() => {
            setIsSubmitting(false);
            alert("Post submitted successfully!");
            navigate("/feed"); // Navigate back to the feed after submission
        }, 1000);
    };

    return (
        <div className="post-page-container">
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Post Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Post Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="media">Media URL (Video/Image)</label>
                    <input
                        type="url"
                        id="media"
                        value={media}
                        onChange={(e) => setMedia(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="song">Song Name</label>
                    <input
                        type="text"
                        id="song"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Post"}
                </button>
            </form>
        </div>
    );
};

export default PostPage;
