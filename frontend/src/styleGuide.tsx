import React from "react";
import "./App.css";

const StyleGuide: React.FC = () => {
  return (
    <div style={{ maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif", backgroundColor: "#121212", color: "#ffffff", padding: "20px" }}>
      <h1 style={{ color: "#1DB954" }}>Music Web App UI Style Guide</h1>
      
      <h2 style={{ color: "#1DB954" }}>Colors</h2>
      <p>Primary: <span style={{ color: "#1DB954" }}>#1DB954</span></p>
      <p>Background: <span style={{ color: "#121212" }}>#121212</span></p>
      <p>Text: <span style={{ color: "#ffffff" }}>#ffffff</span></p>
      
      <h2 style={{ color: "#1DB954" }}>Fonts</h2>
      <p>Use <code style={{ backgroundColor: "#2a2a2a", padding: "5px", borderRadius: "5px", display: "block" }}>font-family: Arial, sans-serif;</code></p>
      
      <h2 style={{ color: "#1DB954" }}>Reusable UI Components</h2>
      
      <h3>Button (with hover functionality)</h3>
      <button style={{ backgroundColor: "#ffffff", color: "#000000", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s" }}>Click Me</button>
      <p>Code:</p>
      <code>
        {`<button class="button-example">Click Me</button>

.button-example {
  background-color: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.button-example:hover {
  background-color: #00ff00;
}`}
      </code>
      
      <h3>Input Fields</h3>
      <input type="text" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }} placeholder="Type here..." />
      <p>Code:</p>
      <code>{`<input type="text" class="input-example" placeholder="Type here...">`}</code>
      
      <h3>Cards</h3>
      <div style={{ background: "#242424", padding: "20px", borderRadius: "10px", margin: "10px 0" }}>
        <h3>Card Title</h3>
        <p>This is an example of a reusable card component.</p>
      </div>
      <p>Code:</p>
      <code>
        {`<div class="card">
  <h3>Card Title</h3>
  <p>This is an example of a reusable card component.</p>
</div>`}
      </code>
      
      <h2 style={{ color: "#1DB954" }}>Navigation Structure</h2>
      <p>Use the following structure for linking pages:</p>
      <code>{`<a href="profile.html">Go to Profile</a>`}</code>
      
      <h2 style={{ color: "#1DB954" }}>Consistent Layout</h2>
      <p>All pages should include a container with max-width 800px for consistency.</p>
      <code>
        {`<div class="container">
  Page content here...
</div>`}
      </code>
    </div>
  );
};

export default StyleGuide;
