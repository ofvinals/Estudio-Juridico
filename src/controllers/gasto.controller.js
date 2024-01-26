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
	const { nroexpte, caratula, concepto, monto, estado } = req.body;

	try {
		const { result } = req.body;
		// Crear una nueva instancia del modelo Gasto utilizando los datos de la solicitud
		const newGasto = new Gasto({
			nroexpte,
			caratula,
			concepto,
			monto,
			url: result,
			estado,
		});

		if (req.file) {
			const { filename } = req.file;
			const filePath = `/uploads/${filename}`; // ajusta la ruta según tu estructura de archivos
			newGasto.setFile(filename, filePath);
		}
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
		console.log('ID del gasto a actualizar:', req.params.id);

		const { nroexpte, caratula, concepto, comprobante, monto, estado } = req.body;
		console.log('Datos del cuerpo de la solicitud:', req.body);

		const updateGasto = await Gasto.findByIdAndUpdate(
			req.params.id,
			{
				nroexpte,
				caratula,
				concepto,
				comprobante,
				monto,
				estado,
			},
			{
				new: true,
			}
		);
		console.log('Gasto actualizado:', updateGasto);
		res.json(updateGasto);
	} catch (error) {
		console.error('Error al actualizar el gasto:', error);
	 
		if (error.name === 'MongoError' && error.code === 11000) {
		  // Manejar el error de clave duplicada (E11000)
		  return res.status(400).json({ message: 'Error: Clave duplicada', error });
		}
	 
		return res.status(500).json({ message: 'Error interno del servidor', error });
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
