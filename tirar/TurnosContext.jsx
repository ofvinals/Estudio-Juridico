import { createContext, useContext, useState } from 'react';
import {
	createTurnoRequest,
	deleteTurnoRequest,
	getTurnosRequest,
	getTurnoRequest,
	updateTurnoRequest,
} from '../src/api/turnos';

const TurnoContext = createContext();

export const useTurnos = () => {
	const context = useContext(TurnoContext);
	if (!context)
		throw new Error('useTurnos must be used within a TurnoProvider');
	return context;
};

export function TurnoProvider({ children }) {
	const [turnos, setTurnos] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getTurnos = async () => {
		try {
			const res = await getTurnosRequest();
			setTurnos(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteTurno = async (id) => {
		try {
			const res = await deleteTurnoRequest(id);
			if (res.status === 204) console.log(res);
			setTurnos((turnos) => turnos.filter((turno) => turno._id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getTurnos independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getTurnos();
			}, 100);
		}
	};

	const createTurno = async (turno) => {
		try {
			const res = await createTurnoRequest(turno);
			console.log(res.data);
			setIsAuthenticated(true);
			setTurnos(res.data);
		} catch (error) {
			console.log(error);
		} 
	};

	const getTurno = async (id) => {
		try {
			const res = await getTurnoRequest(id);
			setTurnos(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateTurno = async (id, turno) => {
		try {
			await updateTurnoRequest(id, turno);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<TurnoContext.Provider
			value={{
				turnos,
				getTurnos,
				deleteTurno,
				createTurno,
				getTurno,
				updateTurno,
			}}>
			{children}
		</TurnoContext.Provider>
	);
}
