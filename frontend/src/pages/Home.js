import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>🗳️ Welcome to the Next-Gen Voting System</h1>
      <p className="home-subtext">
        Secure, transparent & user-friendly voting — powered by modern web technologies. <br />
        Future-ready: Blockchain integration, biometric validation & AI analytics coming soon!
      </p>

      {token ? (
        <>
          <h3 className="welcome-msg">Hello, {role === 'admin' ? 'Admin' : 'Voter'}! 👋</h3>
          <div className="home-buttons">
            <Link to="/candidates">
              <button className="home-btn">View Candidates</button>
            </Link>
            <button className="home-btn logout" onClick={handleLogout}>Logout</button>
          </div>
        </>
      ) : (
        <div className="home-buttons">
          <Link to="/login">
            <button className="home-btn">Login</button>
          </Link>
          <Link to="/register">
            <button className="home-btn">Register</button>
          </Link>
          <Link to="/candidates">
            <button className="home-btn">View Candidates</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
