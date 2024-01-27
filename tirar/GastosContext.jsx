import { createContext, useContext, useState } from 'react';
import {
	createGastoRequest,
	deleteGastoRequest,
	getGastosRequest,
	getGastoRequest,
	updateGastoRequest,
} from '../src/api/gastos';

const GastoContext = createContext();

export const useGastos = () => {
	const context = useContext(GastoContext);
	if (!context)
		throw new Error('useGastos must be used within a GastoProvider');
	return context;
};

export function GastoProvider({ children }) {
	const [gastos, setGastos] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	const getGastos = async () => {
		try {
			const res = await getGastosRequest();
			setGastos(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const deleteGasto = async (id) => {
		try {
			const res = await deleteGastoRequest(id);
			if (res.status === 204) console.log(res);
			setGastos((gastos) => gastos.filter((gasto) => gasto._id !== id));
		} catch (error) {
			console.log(error);
		} finally {
			// Llama a getGastos independientemente de si hubo éxito o error, con un retardo
			setTimeout(async () => {
				await getGastos();
			}, 100);
		}
	};

	const createGasto = async (gasto) => {
		try {
			const res = await createGastoRequest(gasto);
			console.log(res.data);
			setIsAuthenticated(true);
			setGastos(res.data);
		} catch (error) {
			console.error('Error en la solicitud:', error);
			console.log('Datos de la respuesta:', error.response.data);;
		} 
	};

	const getGasto = async (id) => {
		try {
			const res = await getGastoRequest(id);
			setGastos(res.data);
			return res.data;
		} catch (error) {
			console.error(error);
		}
	};

	const updateGasto = async (id, gasto) => {
		try {
			await updateGastoRequest(id, gasto);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<GastoContext.Provider
			value={{
				gastos,
				getGastos,
				deleteGasto,
				createGasto,
				getGasto,
				updateGasto,
			}}>
			{children}
		</GastoContext.Provider>
	);
}
