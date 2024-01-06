import axios from 'axios';

export const getTurnosRequest = async () => axios.get('http://localhost:4000/api/turnos', { withCredentials: true });

export const createTurnoRequest = async (turno) => axios.post('http://localhost:4000/api/turnos', turno, { withCredentials: true });

export const updateTurnoRequest = async (id, turno) => axios.put(`http://localhost:4000/api/turnos/${id}`, turno, { withCredentials: true });

export const deleteTurnoRequest = async (id) => axios.delete(`http://localhost:4000/api/turnos/${id}`, { withCredentials: true });

export const getTurnoRequest = async (id) => axios.get(`http://localhost:4000/api/turnos/${id}`, { withCredentials: true });
