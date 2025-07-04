import React, { useEffect, useState } from 'react';
import API from '../api/api';
import CandidateCard from '../components/CandidateCard';
import './Candidates.css';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: { first: '', surname: '' },
    party: '',
    age: '',
    qualification: '',
    biography: '',
    imageUrl: ''
  });

  const fetchCandidates = async () => {
    try {
      const res = await API.get('/api/candidate/candidates');
      setCandidates(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch candidates');
    }
  };

  const checkUser = async () => {
  try {
    const role = localStorage.getItem('role'); // Read from localStorage
    setIsAdmin(role === 'admin');


  } catch (e) {
    console.error("User info fetch failed");
  }
};


  useEffect(() => {
    fetchCandidates();
    checkUser();
  }, []);

  const handleSearch = async () => {
    if (!search) return fetchCandidates();
    try {
      const res = await API.get(`/api/candidate/search?q=${search}`);
      setCandidates(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleSort = (order) => {
    const sorted = [...candidates].sort((a, b) =>
      order === 'asc' ? a.votes - b.votes : b.votes - a.votes
    );
    setCandidates(sorted);
    setSortOrder(order);
  };

  const handleAddCandidate = async () => {
    const { name, party, age } = newCandidate;
    if (!name.first || !party || !age) {
      alert('First name, party, and age are required');
      return;
    }
    try {
      await API.post('/api/candidate/add', newCandidate);
      alert('Candidate added!');
      setNewCandidate({ name: { first: '', surname: '' }, party: '', age: '', qualification: '', biography: '', imageUrl: '' });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || 'Add failed');
    }
  };

  return (
    <div className="candidates-container">
      <h2>All Candidates</h2>

      <div className="controls">
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={handleSearch}>Search</button>
        <select onChange={(e) => handleSort(e.target.value)} value={sortOrder}>
          <option value="">Sort by votes</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {isAdmin && (
        <div className="add-candidate-form">
          <h3>Add New Candidate</h3>
          <input type="text" placeholder="First Name" value={newCandidate.name.first} onChange={(e) => setNewCandidate({ ...newCandidate, name: { ...newCandidate.name, first: e.target.value } })} />
          <input type="text" placeholder="Surname" value={newCandidate.name.surname} onChange={(e) => setNewCandidate({ ...newCandidate, name: { ...newCandidate.name, surname: e.target.value } })} />
          <input type="text" placeholder="Party" value={newCandidate.party} onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })} />
          <input type="number" placeholder="Age" value={newCandidate.age} onChange={(e) => setNewCandidate({ ...newCandidate, age: e.target.value })} />
          <input type="text" placeholder="Qualification" value={newCandidate.qualification} onChange={(e) => setNewCandidate({ ...newCandidate, qualification: e.target.value })} />
          <input type="text" placeholder="Biography" value={newCandidate.biography} onChange={(e) => setNewCandidate({ ...newCandidate, biography: e.target.value })} />
          <input type="text" placeholder="Image URL" value={newCandidate.imageUrl} onChange={(e) => setNewCandidate({ ...newCandidate, imageUrl: e.target.value })} />
          <button onClick={handleAddCandidate}>Add Candidate</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="candidates-grid">
        {candidates.map(candidate => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            hasVoted={hasVoted}
            isAdmin={isAdmin}
            onVoteSuccess={fetchCandidates}
          />
        ))}
      </div>
    </div>
  );
};

export default Candidates;
