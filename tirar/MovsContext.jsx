import { createContext, useContext, useState } from 'react';
import {
	createMovRequest,
	deleteMovRequest,
	getMovsRequest,
	getMovRequest,
	updateMovRequest,
} from './movs';

const MovContext = createContext();

export const useMovs = () => {
	const context = useContext(MovContext);
	if (!context) throw new Error('useMovs must be used within a MovProvider');
	return context;
};

export function MovProvider({ children }) {
	const [movs, setMovs] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getMovs = async () => {
		try {
			const res = await getMovsRequest();
			setMovs(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteMov = async (id) => {
		try {
			const res = await deleteMovRequest(id);
			if (res.status === 204) console.log(res);
			setMovs((movs) => movs.filter((mov) => mov._id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getMovs independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getMovs();
			}, 100);
		}
	};

	const createMov = async (mov) => {
		try {
			const res = await createMovRequest(mov);
			console.log(res.data);
			setIsAuthenticated(true);
			setMovs(res.data);
		} catch (error) {
			console.log(error);
		}
	};

	const getMov = async (id) => {
		try {
			const res = await getMovRequest(id);
			setMovs(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateMov = async (id, mov) => {
		try {
			await updateMovRequest(id, mov);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<MovContext.Provider
			value={{
				movs,
				getMovs,
				deleteMov,
				createMov,
				getMov,
				updateMov,
			}}>
			{children}
		</MovContext.Provider>
	);
}
