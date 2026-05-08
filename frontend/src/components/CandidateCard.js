import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  voteCandidate,
  fetchCandidates,
  deleteCandidate // optional thunk
} from '../redux/slices/candidateSlice';
import './CandidateCard.css';

const CandidateCard = ({ candidate, hasVoted, isAdmin }) => {
  const dispatch = useDispatch();
  const voteMessage = useSelector((state) => state.candidate.voteMessage);
  const [loading, setLoading] = React.useState(false);

  const handleVote = async () => {
    setLoading(true);
    try {
      const res = await dispatch(voteCandidate(candidate.candidateId)).unwrap();
      alert(res.message || voteMessage);
      dispatch(fetchCandidates());
    } catch (err) {
      alert(err || 'Failed to vote');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;
    try {
      const res = await dispatch(deleteCandidate(candidate.candidateId)).unwrap();
      alert(res.message || 'Candidate deleted');
      dispatch(fetchCandidates());
    } catch (err) {
      alert(err || 'Failed to delete');
    }
  };

  return (
    <div className="candidate-card">
      <h3>{candidate.name.first} {candidate.name.surname}</h3>
      <p><strong>Party:</strong> {candidate.party}</p>
      <p><strong>Votes:</strong> {candidate.votes}</p>

      {!isAdmin && (
        <button onClick={handleVote} disabled={loading || hasVoted}>
          {hasVoted ? "✅ Already Voted" : loading ? "Voting..." : "🗳️ Vote"}
        </button>
      )}

      {isAdmin && (
        <button onClick={handleDelete} className="delete-button">
          🗑️ Delete
        </button>
      )}
    </div>
  );
};

export default CandidateCard;
