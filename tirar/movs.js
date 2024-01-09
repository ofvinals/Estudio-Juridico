import axios from 'axios';

export const getMovsRequest = async () => axios.get('http://localhost:4000/api/movs', { withCredentials: true });

export const createMovRequest = async (mov) => axios.post('http://localhost:4000/api/movs', mov, { withCredentials: true });

export const updateMovRequest = async (id, mov) => axios.put(`http://localhost:4000/api/movs/${id}`, mov, { withCredentials: true });

export const deleteMovRequest = async (id) => axios.delete(`http://localhost:4000/api/movs/${id}`, { withCredentials: true });

export const getMovRequest = async (id) => axios.get(`http://localhost:4000/api/movs/${id}`, { withCredentials: true });
