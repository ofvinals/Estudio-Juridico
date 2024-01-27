import { createContext, useContext, useState } from 'react';
import {
	createExpteRequest,
	deleteExpteRequest,
	getExptesRequest,
	getExpteRequest,
	updateExpteRequest,
	createMovRequest,
	deleteMovRequest,
} from '../src/api/exptes';

const ExpteContext = createContext();

export const useExptes = () => {
	const context = useContext(ExpteContext);
	if (!context)
		throw new Error('useExptes must be used within a ExpteProvider');
	return context;
};

export function ExpteProvider({ children }) {
	const [exptes, setExptes] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getExptes = async () => {
		try {
			const res = await getExptesRequest();
			setExptes(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteExpte = async (id) => {
		try {
			const res = await deleteExpteRequest(id);
			if (res.status === 204) console.log(res);
			setExptes((exptes) => exptes.filter((expte) => expte._id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getExptes independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getExptes();
			}, 100);
		}
	};

	const createExpte = async (expte) => {
		try {
			const res = await createExpteRequest(expte);
			console.log(res.data);
			setIsAuthenticated(true);
			setExptes(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getExpte = async (id) => {
		try {
			const res = await getExpteRequest(id);
			setExptes(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateExpte = async (id, expte) => {
		try {
			await updateExpteRequest(id, expte);
		} catch (error) {
			console.error(error);
		}
	};

	const createMov = async (id, expte) => {
		try {
			await createMovRequest(id, expte);
		} catch (error) {
			console.error(error);
		}
	};

	const deleteMov = async (expedienteId, movimientoId) => {
		try {
			const res = await deleteMovRequest(expedienteId, movimientoId);
			if (res.status === 204) console.log(res);
		} catch (error) {
			console.log(error);
		} finally {
			setTimeout(async () => {
				await getExptes();
			}, 100);
		}
	};

	return (
		<ExpteContext.Provider
			value={{
				exptes,
				getExptes,
				deleteExpte,
				createExpte,
				getExpte,
				updateExpte,
				createMov,
				deleteMov,
			}}>
			{children}
		</ExpteContext.Provider>
	);
}
