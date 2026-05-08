// src/pages/Vote.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { voteCandidate } from '../redux/slices/candidateSlice';
import API from '../api/api';
import './Vote.css';

const Vote = () => {
  const { id } = useParams(); // candidateId or _id
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [candidate, setCandidate] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const res = await API.get('/api/candidate/candidates');
        const found = res.data.candidates?.find(c => c._id === id || c.candidateId === id);
        if (found) {
          setCandidate(found);
        } else {
          setMessage('❌ Candidate not found');
        }
      } catch (err) {
        setMessage('❌ Error loading candidate');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [id]);

  const handleVote = async () => {
    if (!candidate) return;

    try {
      const resultAction = await dispatch(voteCandidate(candidate.candidateId)).unwrap();
      setMessage(resultAction.message || '✅ Vote submitted successfully!');
      setVoted(true);

      setTimeout(() => {
        navigate('/candidates');
      }, 2000);
    } catch (err) {
      setMessage(err || '❌ Failed to vote');
    }
  };

  if (loading) return <p className="vote-loading">Loading candidate...</p>;
  if (!candidate) return <p className="vote-loading">{message}</p>;

  return (
    <div className="vote-container">
      <h2>Vote for {candidate.name?.first} {candidate.name?.surname}</h2>
      <p>Party: {candidate.party}</p>

      <button onClick={handleVote} disabled={voted}>
        {voted ? '✅ Voted' : 'Submit Vote'}
      </button>

      {message && <p className="vote-message">{message}</p>}
    </div>
  );
};

export default Vote;
