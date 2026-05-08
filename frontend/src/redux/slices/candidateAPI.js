import API from '../../api/api';

export const fetchCandidatesAPI = ({ page = 1, limit = 6 }) =>
  API.get(`/api/candidate/candidates?page=${page}&limit=${limit}`);

export const voteCandidateAPI = (candidateId) =>
  API.post('/api/candidate/vote', { candidateId });

export const searchCandidateAPI = (query) =>
  API.get(`/api/candidate/search?q=${query}`);

export const addCandidateAPI = (candidateData) =>
  API.post('/api/candidate/add', candidateData);
