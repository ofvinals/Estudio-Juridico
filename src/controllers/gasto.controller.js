import Gasto from '../models/gasto.model.js';

export const getGastos = async (req, res) => {
	try {
		const gastos = await Gasto.find();
		res.json(gastos);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createGasto = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const { nroexpte, concepto, comprobante, monto, estado } = req.body;

	try {
		// Crear una nueva instancia del modelo Gasto utilizando los datos de la solicitud
		const newGasto = new Gasto({
			nroexpte,
			concepto,
			comprobante,
			monto,
			estado,
		});
		const savedGasto = await newGasto.save();

		// envia respuesta del registro al frontend
		res.json({
			id: savedGasto._id,
			nroexpte: savedGasto.nroexpte,
			createdAt: savedGasto.createdAt,
		});
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getGasto = async (req, res) => {
	try {
		const gasto = await Gasto.findById(req.params.id);
		if (!gasto)
			return res.status(404).json({ message: 'Gasto no encontrado' });
		res.json(gasto);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateGasto = async (req, res) => {
	try {
		const { nroexpte, concepto, comprobante, monto, estado } = req.body;
		const updateGasto = await Gasto.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		);
		res.json(updateGasto);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteGasto = async (req, res) => {
	try {
		const deletedGasto = await Gasto.findByIdAndDelete(req.params.id);
		if (!deletedGasto)
			return res.status(404).json({ message: 'Gasto no encontrado' });

		res.json(deletedGasto);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
