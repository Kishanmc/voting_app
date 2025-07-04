
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Candidates from './pages/Candidates';
import Vote from './pages/Vote';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/vote/:id" element={<Vote />} />
      </Routes>
    </Router>
  );
}

export default App;
