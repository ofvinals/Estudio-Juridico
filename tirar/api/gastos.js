import axios from 'axios';

export const getGastosRequest = async () => axios.get('http://localhost:4000/api/gastos', { withCredentials: true });

export const createGastoRequest = async (gasto) => axios.post('http://localhost:4000/api/gastos', gasto, { withCredentials: true });

export const updateGastoRequest = async (id, gasto) => axios.put(`http://localhost:4000/api/gastos/${id}`, gasto, { withCredentials: true });

export const deleteGastoRequest = async (id) => axios.delete(`http://localhost:4000/api/gastos/${id}`, { withCredentials: true });

export const getGastoRequest = async (id) => axios.get(`http://localhost:4000/api/gastos/${id}`, { withCredentials: true });
