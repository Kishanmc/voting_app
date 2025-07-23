import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({ user: '', password: '', role: 'voter' });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    if (name === 'user' && !value) return 'ID is required';
    if (name === 'password' && value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const msg = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const isFormValid = () => {
    const newErrors = {};
    ['user', 'password'].forEach(field => {
      const msg = validateField(field, formData[field]);
      if (msg) newErrors[field] = msg;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!isFormValid()) return;

    try {
      const res = await API.post('/api/user/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', formData.role);
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
          placeholder={formData.role === 'admin' ? 'Admin ID' : 'Voter ID'}
          value={formData.user}
          onChange={handleChange}
          className={errors.user ? 'input-error' : ''}
        />
        {errors.user && <small className="error-msg">{errors.user}</small>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <small className="error-msg">{errors.password}</small>}

        <select name="role" value={formData.role} onChange={handleChange}>
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
