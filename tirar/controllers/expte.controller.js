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
			estado,
		} = req.body;

		const caratula = `${actor} C/ ${demandado} S/ ${proceso}`;

		const updateExpte = await Expte.findByIdAndUpdate(
			req.params.id,
			{
				cliente,
				nroexpte,
				radicacion,
				juzgado,
				actor,
				demandado,
				proceso,
				caratula,
				estado,
			},
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

export const createMov = async (req, res) => {
	const { fecha, descripcion } = req.body;
	try {
		const { result } = req.body;
		const expteId = req.params.id; // Asegúrate de ajustar esto según tu ruta de API

		// Buscar el expediente por ID
		const expte = await Expte.findById(expteId);
		if (!expte) {
			return res.status(404).json({ message: 'Expediente no encontrado' });
		}

		// Crear una nueva instancia del modelo Expte utilizando los datos de la solicitud
		const newMovimiento = {
			fecha,
			descripcion,
			url:result
		};

		if (req.file) {
			const { filename } = req.file;
			const filePath = `/uploads/${filename}`; // ajusta la ruta según tu estructura de archivos
			newMovimiento.setFile(filename, filePath);
		}

		expte.movimientos.push(newMovimiento);

		// Guardar el expediente actualizado en la base de datos
		const savedExpte = await expte.save();
		res.json(savedExpte.movimientos);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteMov = async (req, res) => {
   try {
      const { expedienteId, movimientoId } = req.params; // Obtén los parámetros desde la URL
		const deletedMov = await Expte.findByIdAndUpdate(
         expedienteId,
         { $pull: { movimientos: { _id: movimientoId } } },
         { new: true }
      );
      if (!deletedMov) {
         return res.status(404).json({ message: 'Expediente no encontrado' });
      }
      res.json(deletedMov);
   } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      return res.status(500).json({ message: error.message });
   }
};
