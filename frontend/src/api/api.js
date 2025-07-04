
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Change this if your backend is hosted elsewhere
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
