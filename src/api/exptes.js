import axios from 'axios';

export const getExptesRequest = async () =>
	axios.get('http://localhost:4000/api/exptes', { withCredentials: true });

export const createExpteRequest = async (expte) =>
	axios.post('http://localhost:4000/api/exptes', expte, {
		withCredentials: true,
	});

export const updateExpteRequest = async (id, expte) =>
	axios.put(`http://localhost:4000/api/exptes/${id}`, expte, {
		withCredentials: true,
	});

export const deleteExpteRequest = async (id) =>
	axios.delete(`http://localhost:4000/api/exptes/${id}`, {
		withCredentials: true,
	});

export const getExpteRequest = async (id) =>
	axios.get(`http://localhost:4000/api/exptes/${id}`, {
		withCredentials: true,
	});

export const createMovRequest = async (id, expte) => {
	axios.post(
		`http://localhost:4000/api/exptes/${expte}/movimientos`,
		id,
		{
			withCredentials: true,
		}
	);
};

export const deleteMovRequest = async (expedienteId, movimientoId) => {
	try {
		const url = `http://localhost:4000/api/exptes/${expedienteId}/movimientos/${movimientoId}`;
		const response =await axios.delete(url, { withCredentials: true });
		if (!response || !response.status) {
         console.error('Respuesta del servidor:', response);
         throw new Error('Error inesperado en la respuesta del servidor');
      }

      return response.data;
		
	} catch (error) {
		console.error('Error en la solicitud de eliminación:', error);
		throw error.response.data; // Asegúrate de lanzar el error para que sea capturado en la función que llama
	}
};
