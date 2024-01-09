import Caja from '../models/caja.model.js';

export const getCajas = async (req, res) => {
	try {
		const cajas = await Caja.find();
		res.json(cajas);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createCaja = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const {
		fecha,
		concepto,
		tipo,
		monto,
		adjunto,
		estado,
	} = req.body;

	try {
		// Crear una nueva instancia del modelo Caja utilizando los datos de la solicitud
		const newCaja = new Caja({
			fecha,
			concepto,
			tipo,
			monto,
			adjunto,
			estado,
		});
		const savedCaja = await newCaja.save();

		res.json(savedCaja);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getCaja = async (req, res) => {
	try {
		const caja = await Caja.findById(req.params.id);
		if (!caja)
			return res.status(404).json({ message: 'Expediente no encontrado' });
		res.json(caja);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateCaja = async (req, res) => {
	try {
		const {
			fecha,
			concepto,
			tipo,
			monto,
			adjunto,
			estado,
		} = req.body;

		const updateCaja = await Caja.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);
		res.json(updateCaja);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteCaja = async (req, res) => {
	try {
		const deletedCaja = await Caja.findByIdAndDelete(req.params.id);
		if (!deletedCaja)
			return res.status(404).json({ message: 'Expediente no encontrado' });

		res.json(deletedCaja);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
