import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from './components/Box';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Box></Box>
        <p>Register</p>
        <input type="text" placeholder="Email" />
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Password" />
        <input type="text" placeholder="Confirm Password" />
        <button>Register</button>
        <p>Login</p>
        <input type="text" placeholder="Username" />
        <input type="text" placeholder="Password" />
        <button>Login</button>
      </header>
    </div>
  );
}

export default App;
