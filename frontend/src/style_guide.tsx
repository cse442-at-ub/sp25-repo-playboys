import React from 'react';

const StyleGuide: React.FC = () => {
  return (
    <div className="style_guide_container">
      {/* Inline styles with all class selectors prefixed with "style_guide_" */}
      <style>{`
        body {
          font-family: Arial, sans-serif;
          background-color: #121212;
          color: #ffffff;
          padding: 20px;
        }
        h1, h2 {
          color: #1DB954;
        }
        code {
          background-color: #2a2a2a;
          padding: 5px;
          border-radius: 5px;
          display: block;
        }
        .style_guide_container {
          max-width: 800px;
          margin: auto;
        }
        .style_guide_button-example {
          background-color: #ffffff;
          color: #000000;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .style_guide_button-example:hover {
          background-color: #00ff00;
        }
        .style_guide_input-example {
          padding: 10px;
          border-radius: 5px;
          border: 1px solid #ccc;
          width: 100%;
        }
        .style_guide_card {
          background: #242424;
          padding: 20px;
          border-radius: 10px;
          margin: 10px 0;
        }
      `}</style>

      <h1>Music Web App UI Style Guide</h1>
      <a href="https://se-dev.cse.buffalo.edu/CSE442/2025-Spring/cse-442ah/">
        <h1>Home Page</h1>
      </a>

      <h2>Colors</h2>
      <p>
        Primary: <span style={{ color: '#1DB954' }}>#1DB954</span>
      </p>
      <p>
        Background: <span style={{ color: '#121212' }}>#121212</span>
      </p>
      <p>
        Text: <span style={{ color: '#ffffff' }}>#ffffff</span>
      </p>

      <h2>Fonts</h2>
      <p>
        Use <code>font-family: Arial, sans-serif;</code>
      </p>

      <h2>Reusable UI Components</h2>

      <h3>Button (with hover functionality)</h3>
      <button className="style_guide_button-example">Click Me</button>
      <p>Code:</p>
      <code>
        {`<button className="style_guide_button-example">Click Me</button>

.style_guide_button-example {
    background-color: #ffffff;
    color: #000000;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}
.style_guide_button-example:hover {
    background-color: #00ff00;
}`}
      </code>

      <h3>Input Fields</h3>
      <input
        type="text"
        className="style_guide_input-example"
        placeholder="Type here..."
      />
      <p>Code:</p>
      <code>
        {`<input type="text" className="style_guide_input-example" placeholder="Type here..." />`}
      </code>

      <h3>Cards</h3>
      <div className="style_guide_card">
        <h3>Card Title</h3>
        <p>This is an example of a reusable card component.</p>
      </div>
      <p>Code:</p>
      <code>
        {`<div className="style_guide_card">
    <h3>Card Title</h3>
    <p>This is an example of a reusable card component.</p>
</div>`}
      </code>

      <h2>Navigation Structure</h2>
      <p>Use the following structure for linking pages:</p>
      <code>{`<a href="profile.html">Go to Profile</a>`}</code>

      <h2>Consistent Layout</h2>
      <p>
        All pages should include a container with max-width 800px for consistency.
      </p>
      <code>
        {`<div className="style_guide_container">
    Page content here...
</div>`}
      </code>
    </div>
  );
};

export default StyleGuide;
