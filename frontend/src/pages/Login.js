import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ user: '', password: '', role: 'voter' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('/api/user/login', formData); // Sends { user, password, role }
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', formData.role); // Store selected role
    navigate('/candidates');
  } catch (err) {
    setError(err.response?.data?.error || 'Login failed');
  }
};

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          name="user"
          type="text"
          placeholder="Voter ID / Admin ID"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
