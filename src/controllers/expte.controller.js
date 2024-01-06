import Expte from '../models/expte.model.js';

export const getExptes = async (req, res) => {
	try {
		const exptes = await Expte.find();
		res.json(exptes);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createExpte = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const {
		cliente,
		nroexpte,
		radicacion,
		juzgado,
		actor,
		demandado,
		proceso,
		estado,
	} = req.body;

	try {
		// Crear una nueva instancia del modelo Expte utilizando los datos de la solicitud
		const newExpte = new Expte({
			cliente,
			nroexpte,
			radicacion,
			juzgado,
			actor,
			demandado,
			proceso,
			caratula: `${actor} C/ ${demandado} S/ ${proceso}`,
			estado,
			user: req.user.id,
		});
		const savedExpte = await newExpte.save();

		res.json(savedExpte);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const getExpte = async (req, res) => {
	try {
		const expte = await Expte.findById(req.params.id);
		if (!expte)
			return res.status(404).json({ message: 'Expediente no encontrado' });
		res.json(expte);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateExpte = async (req, res) => {
	try {
		const {
			cliente,
			nroexpte,
			radicacion,
			juzgado,
			actor,
			demandado,
			proceso,
			caratula,
			estado,
		} = req.body;
		const updateExpte = await Expte.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		res.json(updateExpte);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteExpte = async (req, res) => {
	try {
		const deletedExpte = await Expte.findByIdAndDelete(req.params.id);
		if (!deletedExpte)
			return res.status(404).json({ message: 'Expediente no encontrado' });

		res.json(deletedExpte);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
