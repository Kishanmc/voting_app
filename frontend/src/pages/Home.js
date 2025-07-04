// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to the Voting System 🗳️</h1>
      <p>Cast your vote securely and easily.</p>
      <div className="home-buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
        <Link to="/candidates">
          <button>View Candidates</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
