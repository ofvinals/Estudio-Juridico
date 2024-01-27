import axios from 'axios';

export const getUsersRequest = async () => axios.get('http://localhost:4000/api/users', { withCredentials: true });

export const createUserRequest = async (user) => axios.post('http://localhost:4000/api/users', user, { withCredentials: true });

export const updateUserRequest = async (id, user) => axios.put(`http://localhost:4000/api/users/${id}`, user, { withCredentials: true });

export const deleteUserRequest = async (id) => axios.delete(`http://localhost:4000/api/users/${id}`, { withCredentials: true });

export const getUserRequest = async (id) => axios.get(`http://localhost:4000/api/users/${id}`, { withCredentials: true });
