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

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let message = '';
    switch (name) {
      case 'user':
        if (!value) message = 'Username is required';
        break;
      case 'password':
        if (value.length < 6) message = 'Password must be at least 6 characters';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = 'Invalid email format';
        break;
      case 'phone':
        if (value && !/^[6-9]\d{9}$/.test(value)) message = 'Invalid phone number';
        break;
      case 'name.first':
        if (!value) message = 'First name is required';
        break;
      case 'dob':
        if (!value) {
          message = 'Date of birth is required';
        } else {
          const today = new Date();
          const dobDate = new Date(value);
          let age = today.getFullYear() - dobDate.getFullYear();
          const m = today.getMonth() - dobDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
            age--;
          }
          if (age < 18) {
            message = 'You must be at least 18 years old';
          } else if (dobDate > today) {
            message = 'DOB cannot be in the future';
          }
        }
        break;
      case 'voterid':
        if (formData.role === 'voter' && !value) message = 'Voter ID is required';
        break;
      case 'adminid':
        if (formData.role === 'admin' && !value) message = 'Admin ID is required';
        break;
      default:
        break;
    }
    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData };

    if (name.startsWith("name.")) {
      const field = name.split('.')[1];
      updatedForm.name = { ...formData.name, [field]: value };
    } else {
      updatedForm[name] = value;

      // Reset IDs if role changes
      if (name === 'role') {
        updatedForm.voterid = '';
        updatedForm.adminid = '';
      }
    }

    setFormData(updatedForm);

    const fieldError = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
  };

  const isFormValid = () => {
    const newErrors = {};
    const requiredFields = ['user', 'password', 'email', 'name.first', 'dob'];
    if (formData.role === 'voter') requiredFields.push('voterid');
    if (formData.role === 'admin') requiredFields.push('adminid');

    requiredFields.forEach(field => {
      const value = field.includes('.') ? formData.name[field.split('.')[1]] : formData[field];
      const msg = validateField(field, value);
      if (msg) newErrors[field] = msg;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!isFormValid()) return;

    try {
      await API.post('/api/user/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  const getInputClass = (field) => errors[field] ? 'input-error' : '';

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input name="user" placeholder="Username" className={getInputClass('user')} onChange={handleChange} />
        {errors.user && <small className="error-msg">{errors.user}</small>}

        <input name="password" type="password" placeholder="Password" className={getInputClass('password')} onChange={handleChange} />
        {errors.password && <small className="error-msg">{errors.password}</small>}

        <select name="role" onChange={handleChange} value={formData.role}>
          <option value="voter">Voter</option>
          <option value="admin">Admin</option>
        </select>

        {formData.role === 'voter' && (
          <>
            <input name="voterid" placeholder="Voter ID" className={getInputClass('voterid')} onChange={handleChange} value={formData.voterid} />
            {errors.voterid && <small className="error-msg">{errors.voterid}</small>}
          </>
        )}

        {formData.role === 'admin' && (
          <>
            <input name="adminid" placeholder="Admin ID" className={getInputClass('adminid')} onChange={handleChange} value={formData.adminid} />
            {errors.adminid && <small className="error-msg">{errors.adminid}</small>}
          </>
        )}

        <input name="name.first" placeholder="First Name" className={getInputClass('name.first')} onChange={handleChange} />
        {errors['name.first'] && <small className="error-msg">{errors['name.first']}</small>}

        <input name="name.last" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" className={getInputClass('email')} onChange={handleChange} />
        {errors.email && <small className="error-msg">{errors.email}</small>}

        <input name="phone" placeholder="Phone" className={getInputClass('phone')} onChange={handleChange} />
        {errors.phone && <small className="error-msg">{errors.phone}</small>}

        <input name="dob" type="date" className={getInputClass('dob')} onChange={handleChange} />
        {errors.dob && <small className="error-msg">{errors.dob}</small>}

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
