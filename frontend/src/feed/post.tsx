import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";

const PostPage = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [media, setMedia] = useState <File | null>(null);
    const [song, setSong] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = React.useState("");

    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('song', song);
        if (media) formData.append('media', media);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/backend/mediaUpload.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include' // for cookies
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                // Handle success
                window.location.href = `${process.env.REACT_APP_API_URL}/#/feed`;    ;
            } else {
                setError(result["message"]);
                // Handle error
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
            // Handle network error
        }
    };

    return (
        <div className="post-page-container">
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
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
                    <label htmlFor="media">Upload Media (Image/Video)</label>
                    <input
                        type="file"
                        id="media"
                        accept="image/*, video/*"
                        onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
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
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default PostPage;
