import React from "react";
import "./login.css";

const Login: React.FC = () => {
  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Login</h2>
            <form>
                <label>Username</label>
                <input type="text" placeholder="Enter your username" />

                <label>Password</label>
                <input type="password" placeholder="Enter a password" />
                <a href="/forgot">Forgot password?</a>
     
                <button type="submit">Submit</button>
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

export default Login;
