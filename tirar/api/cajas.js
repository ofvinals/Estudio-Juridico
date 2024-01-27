import axios from 'axios';

export const getCajasRequest = async () => axios.get('http://localhost:4000/api/cajas', { withCredentials: true });

export const createCajaRequest = async (caja) => axios.post('http://localhost:4000/api/cajas', caja, { withCredentials: true });

export const updateCajaRequest = async (id, caja) => axios.put(`http://localhost:4000/api/cajas/${id}`, caja, { withCredentials: true });

export const deleteCajaRequest = async (id) => axios.delete(`http://localhost:4000/api/cajas/${id}`, { withCredentials: true });

export const getCajaRequest = async (id) => axios.get(`http://localhost:4000/api/cajas/${id}`, { withCredentials: true });
