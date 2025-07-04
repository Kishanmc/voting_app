import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    user: '',
    password: '',
    role: 'voter',
    voterid: '',
    adminid: '',
    name: { first: '', last: '' },
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("name.")) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, name: { ...prev.name, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/user/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="user" placeholder="Username" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>
        <input name="voterid" placeholder="Voter ID" onChange={handleChange} />
        <input name="adminid" placeholder="Admin ID" onChange={handleChange} />
        <input name="name.first" placeholder="First Name" onChange={handleChange} required />
        <input name="name.last" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="dob" type="date" onChange={handleChange} />
        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input name="address" placeholder="Address" onChange={handleChange} />
        <button type="submit">Register</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
