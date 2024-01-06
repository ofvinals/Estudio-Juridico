import Turno from '../models/turno.model.js';

export const getTurnos = async (req, res) => {
	try {
		const turnos = await Turno.find();
		res.json(turnos);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createTurno = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const { turno, email, motivo } =
		req.body;

	try {

		// Crear una nueva instancia del modelo Turno utilizando los datos de la solicitud
		const newTurno = new Turno({
		turno, 
		email, 
		motivo,
		});
		const savedTurno = await newTurno.save();

		// envia respuesta del registro al frontend
		res.json({
			id: savedTurno._id,
			email: savedTurno.email,
			createdAt: savedTurno.createdAt,
		});
	} catch (error) {
		return res.status(500).json(['Error de registro de turno']);
	}
};

export const getTurno = async (req, res) => {
	try {
		const turno = await Turno.findById(req.params.id);
		if (!turno)
			return res.status(404).json({ message: 'Turno no encontrado' });
		res.json(turno);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateTurno = async (req, res) => {
	try {
		const { turno, email, motivo } =
			req.body;
		const updateTurno = await Turno.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updateTurno);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteTurno = async (req, res) => {
	try {
		const deletedTurno = await Turno.findByIdAndDelete(req.params.id);
		if (!deletedTurno)
			return res.status(404).json({ message: 'Turno no encontrado' });

		res.json(deletedTurno);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
