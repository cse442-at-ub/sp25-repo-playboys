import React from "react";
import "./register.css";

const Register: React.FC = () => {

    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirm_password, setconfirm_password] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {username, email, password, confirm_password};
        console.log(data);

        const response = await fetch( `${process.env.REACT_APP_API_URL}backend/register.php`, {
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
            window.location.href = "#/login";
        }
        else {
            console.log(result["message"])
            setError(result["message"]);
        }

    };
        

  return (
    <div className="auth-container">
        <div className="login-box">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)}/>

                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <ul>
                    Password must meet the following requirements:
                    Have at least 8 characters
                    Have at least 1 uppercase characters
                    Have at least 1 special character (!@#$%^&*)</ul>
    

                <label>Password</label>
                <input type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <label>Confirm Password</label>
                <input type="password" placeholder="Reenter your password" value={confirm_password} onChange={(e) => setconfirm_password(e.target.value)} />
                <button type="submit" >Register</button>
                {error && <p className="error-message">{error}</p>}
            </form>
            <div className="register-link">
                <a href="#/login"><span>Return to login</span></a>
            </div>
        </div>
    </div>
  );
};

export default Register;
