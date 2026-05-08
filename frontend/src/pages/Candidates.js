import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCandidates,
  searchCandidates,
  addCandidate,
} from '../redux/slices/candidateSlice';
import CandidateCard from '../components/CandidateCard';
import './Candidates.css';

const Candidates = () => {
  const dispatch = useDispatch();
  const { candidates, status, error, totalPages } = useSelector((state) => state.candidate);

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [page, setPage] = useState(1);
  const [adding, setAdding] = useState(false);

  const [newCandidate, setNewCandidate] = useState({
    name: { first: '', surname: '' },
    party: '',
    age: '',
    qualification: '',
    biography: '',
    imageUrl: ''
  });

  const fetchAllCandidates = useCallback(() => {
    dispatch(fetchCandidates({ page }));
  }, [dispatch, page]);

  const checkUser = useCallback(() => {
    const role = localStorage.getItem('role');
    setIsAdmin(role === 'admin');
  }, []);

  useEffect(() => {
    fetchAllCandidates();
    checkUser();
  }, [fetchAllCandidates, checkUser]);

  const handleSearch = () => {
    if (!search.trim()) {
      fetchAllCandidates();
    } else {
      dispatch(searchCandidates(search));
    }
  };

  const handleSort = (order) => {
    setSortOrder(order);
  };

  const handleAddCandidate = async () => {
    const { name, party, age } = newCandidate;

    if (!name.first || !party || !age) {
      alert('First name, party, and age are required');
      return;
    }

    setAdding(true);
    try {
      await dispatch(addCandidate(newCandidate)).unwrap();
      alert('✅ Candidate added!');
      setNewCandidate({
        name: { first: '', surname: '' },
        party: '',
        age: '',
        qualification: '',
        biography: '',
        imageUrl: ''
      });
      fetchAllCandidates();
    } catch (err) {
      alert(err || '❌ Failed to add candidate');
    } finally {
      setAdding(false);
    }
  };

  const sortedCandidates = useMemo(() => {
    const list = [...candidates];
    if (sortOrder === 'asc') return list.sort((a, b) => a.votes - b.votes);
    if (sortOrder === 'desc') return list.sort((a, b) => b.votes - a.votes);
    return list;
  }, [candidates, sortOrder]);

  return (
    <div className="candidates-container">
      <h2>All Candidates</h2>

      <div className="controls">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
          <input
            type="text"
            placeholder="First Name"
            value={newCandidate.name.first}
            onChange={(e) =>
              setNewCandidate({
                ...newCandidate,
                name: { ...newCandidate.name, first: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Surname"
            value={newCandidate.name.surname}
            onChange={(e) =>
              setNewCandidate({
                ...newCandidate,
                name: { ...newCandidate.name, surname: e.target.value },
              })
            }
          />
          <input
            type="text"
            placeholder="Party"
            value={newCandidate.party}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, party: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Age"
            value={newCandidate.age}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, age: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Qualification"
            value={newCandidate.qualification}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, qualification: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Biography"
            value={newCandidate.biography}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, biography: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newCandidate.imageUrl}
            onChange={(e) =>
              setNewCandidate({ ...newCandidate, imageUrl: e.target.value })
            }
          />
          <button onClick={handleAddCandidate} disabled={adding}>
            {adding ? 'Adding...' : 'Add Candidate'}
          </button>
        </div>
      )}

      {status === 'loading' && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="candidates-grid">
        {sortedCandidates.map((candidate) => (
          <CandidateCard
            key={candidate._id}
            candidate={candidate}
            hasVoted={hasVoted}
            isAdmin={isAdmin}
            onVoteSuccess={fetchAllCandidates}
          />
        ))}
      </div>

      <div className="pagination-controls">
        <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Candidates;
