import axios from 'axios';

export const getExptesRequest = async () => axios.get('http://localhost:4000/api/exptes', { withCredentials: true });

export const createExpteRequest = async (expte) => axios.post('http://localhost:4000/api/exptes', expte, { withCredentials: true });

export const updateExpteRequest = async (id, expte) => axios.put(`http://localhost:4000/api/exptes/${id}`, expte, { withCredentials: true });

export const deleteExpteRequest = async (id) => axios.delete(`http://localhost:4000/api/exptes/${id}`, { withCredentials: true });

export const getExpteRequest = async (id) => axios.get(`http://localhost:4000/api/exptes/${id}`, { withCredentials: true });
