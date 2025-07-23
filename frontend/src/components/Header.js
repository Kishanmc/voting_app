import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink exact="true" to="/" className="nav-link" activeclassname="active">Home</NavLink>
      <NavLink to="/candidates" className="nav-link" activeclassname="active">Candidates</NavLink>

      {!token && (
        <>
          <NavLink to="/login" className="nav-link" activeclassname="active">Login</NavLink>
          <NavLink to="/register" className="nav-link" activeclassname="active">Register</NavLink>
        </>
      )}

      {token && (
        <>
          <span className="nav-role">Logged in as: <strong>{role}</strong></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      )}
    </nav>
  );
};

export default Header;
