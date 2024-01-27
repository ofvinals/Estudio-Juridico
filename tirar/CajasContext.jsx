import { createContext, useContext, useState } from 'react';
import {
	createCajaRequest,
	deleteCajaRequest,
	getCajasRequest,
	getCajaRequest,
	updateCajaRequest,
} from '../src/api/cajas';

const CajaContext = createContext();

export const useCajas = () => {
	const context = useContext(CajaContext);
	if (!context)
		throw new Error('useCajas must be used within a CajaProvider');
	return context;
};

export function CajaProvider({ children }) {
	const [cajas, setCajas] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getCajas = async () => {
		try {
			const res = await getCajasRequest();
			setCajas(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteCaja = async (id) => {
		try {
			const res = await deleteCajaRequest(id);
			if (res.status === 204) console.log(res);
			setCajas((cajas) => cajas.filter((caja) => caja._id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getCajas independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getCajas();
			}, 100);
		}
	};

	const createCaja = async (caja) => {
		try {
			const res = await createCajaRequest(caja);
			console.log(res.data);
			setIsAuthenticated(true);
			setCajas(res.data);
		} catch (error) {
			console.log(error);
		} 
	};

	const getCaja = async (id) => {
		try {
			const res = await getCajaRequest(id);
			setCajas(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateCaja = async (id, caja) => {
		try {
			await updateCajaRequest(id, caja);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<CajaContext.Provider
			value={{
				cajas,
				getCajas,
				deleteCaja,
				createCaja,
				getCaja,
				updateCaja,
			}}>
			{children}
		</CajaContext.Provider>
	);
}
