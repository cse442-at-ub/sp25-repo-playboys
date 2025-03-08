import React from "react";
import "./mobile_login.css";

const MobileLogin: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {username, password};
        console.log(data);

        //request sign in with global+/login.php as path
        const response = await fetch(`${process.env.REACT_APP_API_URL}backend/login.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();
        console.log(result);
        console.log(result["status"]);

        if (result["status"] === "success") {
            window.location.href = "#/userprofile";
        }
        else {
            setError(result["message"]);
        }
    };


  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <label>Password</label>
                <input type="password" placeholder="Enter a password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <a href="#/forgot">Forgot password ?</a>
     
                <button type="submit">Submit</button>
                {error && <p className="error-message">{error}</p>}
            </form>
        
            <div className="social-login">
                <h3>Or login with</h3>
                <button id="spotify-login">
                    {/* <img src="/icons/spotify.svg" alt="Spotify" className="social-icon" /> */}
                    Login With Spotify
                </button>

                <button id="apple-login">
                    {/* <img src="/icons/apple-music.svg" alt="Apple Music" className="social-icon" /> */}
                    Login With Apple Music
                </button>
            </div>
        </div>
    </div>
  );
};

export default MobileLogin;
