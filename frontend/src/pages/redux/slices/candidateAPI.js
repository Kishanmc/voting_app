import API from '../../../api/api';

export const fetchCandidatesAPI = () => API.get('/api/candidate/candidates');
export const voteCandidateAPI = (candidateId) => API.post('/api/candidate/vote', { candidateId });
export const searchCandidateAPI = (query) => API.get(`/api/candidate/search?q=${query}`);
export const addCandidateAPI = (candidateData) => API.post('/api/candidate/add', candidateData);
