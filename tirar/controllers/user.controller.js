import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const createUser = async (req, res) => {
	// Extraer los campos del cuerpo de la solicitud (request body)
	const { username, apellido, email, dni, domicilio, celular, password } =
		req.body;

	try {
		// encripta el password (bcrypt instalado)
		const passwordHash = await bcrypt.hash(password, 10);
		// Crear una nueva instancia del modelo User utilizando los datos de la solicitud
		const newUser = new User({
			username,
			apellido,
			email,
			dni,
			domicilio,
			celular,
			password: passwordHash,
		});
		const savedUser = await newUser.save();

		// crea el token
		const token = await createAccessToken({ id: savedUser._id });

		res.cookie('token', token);

		// envia respuesta del registro al frontend
		res.json({
			id: savedUser._id,
			email: savedUser.email,
			createdAt: savedUser.createdAt,
		});
	} catch (error) {
		return res.status(500).json(['Error de registro de usuario']);
	}
};

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });
		res.json(user);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const { username, apellido, email, dni, domicilio, celular, password } =
			req.body;
		const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		});
		res.json(updateUser);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const deletedUser = await User.findByIdAndDelete(req.params.id);
		if (!deletedUser)
			return res.status(404).json({ message: 'Expediente no encontrado' });

		res.json(deletedUser);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
