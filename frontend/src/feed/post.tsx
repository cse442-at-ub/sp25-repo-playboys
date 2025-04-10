import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./post.css";

const PostPage = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [media, setMedia] = useState<File | null>(null);
    const [song, setSong] = useState<string>("");
    const [community, setCommunity] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = React.useState("");
    const { csrfToken } = useCSRFToken();
    const [communities, setCommunities] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}backend/communities_functions/getAllcomms.php`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'CSRF-Token': csrfToken }
                });

                const data = await response.json();
                const names = data.map((community: { community_name: string }) => community.community_name);
                setCommunities(names);
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };
        fetchCommunities();
    }, []);

    


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('song', song);
        if (media) formData.append('media', media);
        formData.append('community', community);
    
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/backend/mediaUpload.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                }
            );

            const result = await response.json();
            if (result.status === "success") {
                navigate("/feed");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.log(error);
            setError("Only images are accepted. Please try again.");
        }
    };

    return (
        <div className="post-page-container">
            <h1 className="post-page-header">Create a New Post</h1>
            <form
                onSubmit={handleSubmit}
                className="post-page-form"
                encType="multipart/form-data"
            >
                <div className="post-form-group">
                    <label htmlFor="title" className="post-form-label">
                        Post Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        className="post-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="post-form-group">
                    <label htmlFor="description" className="post-form-label">
                        Post Description
                    </label>
                    <textarea
                        id="description"
                        className="post-textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>

                <div className="post-form-group">
                    <label htmlFor="media" className="post-form-label">
                        Upload Media (Image/Video)
                    </label>
                    <input
                        type="file"
                        id="media"
                        className="post-input"
                        accept="image/*, video/*"
                        onChange={(e) => setMedia(e.target.files?.[0] || null)}
                    />
                </div>

                <div className="post-form-group">
                    <label htmlFor="song" className="post-form-label">
                        Song Name
                    </label>
                    <input
                        type="text"
                        id="song"
                        className="post-input"
                        value={song}
                        onChange={(e) => setSong(e.target.value)}
                        required
                    />
                </div>
                
                <div className="post-form-group">
                    <label className="post-label" htmlFor="community">Choose a community</label>
                    <select
                        className="post-input"
                        id="community"
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a community</option>
                        {communities.map((community, index) => (
                            <option key={index} value={community}>{community}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="post-submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Post"}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default PostPage;
