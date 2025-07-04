import React, { useState } from 'react';
import API from '../api/api';
import './CandidateCard.css';

const CandidateCard = ({ candidate, onVoteSuccess, hasVoted, isAdmin }) => {
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    setLoading(true);
    try {
      const res = await API.post('/api/candidate/vote', {
        candidateId: candidate.candidateId,
      });
      alert(res.data.message);
      onVoteSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      await API.delete(`/api/candidate/delete/${candidate.candidateId}`);
      alert('Candidate deleted');
      onVoteSuccess();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="candidate-card">
      <h3>{candidate.name.first} {candidate.name.surname}</h3>
      <p><strong>Party:</strong> {candidate.party}</p>
      <p><strong>Votes:</strong> {candidate.votes}</p>

      {!isAdmin && (
        <button onClick={handleVote} disabled={loading || hasVoted}>
          {hasVoted ? "Already Voted" : loading ? "Voting..." : "Vote"}
        </button>
      )}

      {isAdmin && (
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      )}
    </div>
  );
};

export default CandidateCard;
