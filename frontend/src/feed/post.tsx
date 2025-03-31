import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";
import { useCSRFToken } from '../csrfContent';

const PostPage = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [media, setMedia] = useState<File | null>(null);
    const [song, setSong] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = React.useState("");
    const { csrfToken } = useCSRFToken();

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('song', song);
        if (media) formData.append('media', media);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}backend/mediaUpload.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: { 'CSRF-Token': csrfToken }
            });
            
            const result = await response.json();
            if (result.status === 'success') {
                window.location.href = `${process.env.REACT_APP_API_URL}/#/feed`;
            } else {
                setError(result["message"]);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="post-page-container">
            <h1 className="post-h1">Create a New Post</h1>
            <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
                <div className="post-form-group">
                    <label className="post-label" htmlFor="title">Post Title</label>
                    <input
                        className="post-input"
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="post-form-group">
                    <label className="post-label" htmlFor="description">Post Description</label>
                    <textarea
                        className="post-textarea"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="post-form-group">
                    <label className="post-label" htmlFor="media">Upload Media (Image/Video)</label>
                    <input
                        className="post-input"
                        type="file"
                        id="media"
                        accept="image/*, video/*"
                        onChange={(e) => setMedia(e.target.files?.[0] ?? null)}
                        required
                    />
                </div>

                <div className="post-form-group">
                    <label className="post-label" htmlFor="song">Song Name</label>
                    <input
                        className="post-input"
                        type="text"
                        id="song"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        required
                    />
                </div>

                <button 
                    className="post-button"
                    type="submit" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Post"}
                </button>
            </form>
            {error && <p className="post-error-message">{error}</p>}
        </div>
    );
};

export default PostPage;
