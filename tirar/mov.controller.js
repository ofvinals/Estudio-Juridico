import Mov from './mov.model.js';

export const getMovs = async (req, res) => {
	try {
		const movs = await Mov.find();
		res.json(movs);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createMov = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const { fecha, descripcion, adjunto } = req.body;

	try {
		// Crear una nueva instancia del modelo Mov utilizando los datos de la solicitud
		const newMov = new Mov({
			fecha,
			descripcion,
			adjunto,
		});
		const savedMov = await newMov.save();
		// Agrega el ID del movimiento al expediente correspondiente
		const updatedExpte = await Expte.findOneAndUpdate(
			{ _id },
			{ $push: { movimientos: savedMov._id } },
			{ new: true }
		);

		res.json({ movimiento: savedMov, expediente: updatedExpte });
		res.json(savedMov);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getMov = async (req, res) => {
	try {
		const mov = await Mov.findById(req.params.id);
		if (!mov)
			return res.status(404).json({ message: 'Expediente no encontrado' });
		res.json(mov);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateMov = async (req, res) => {
	try {
		const { fecha, descripcion, adjunto } = req.body;

		const updateMov = await Mov.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updateMov);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteMov = async (req, res) => {
	try {
		const deletedMov = await Mov.findByIdAndDelete(req.params.id);
		if (!deletedMov)
			return res.status(404).json({ message: 'Expediente no encontrado' });

		res.json(deletedMov);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
