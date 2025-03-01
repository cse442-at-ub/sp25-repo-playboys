import React from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

//import all the pages created in the frontend

import Register from "./login_screens/register/register";
import Login from "./login_screens/login/login";
import Forgot from "./login_screens/forgot/forgot";


function App() {
  return (
    //add routes for each page created in the frontend
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<Forgot />} />

      </Routes>
    </Router>
  );
}

export default App;

