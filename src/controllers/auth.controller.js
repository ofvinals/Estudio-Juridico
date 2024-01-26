import { createAccessToken } from '../libs/jwt.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const register = async (req, res) => {
	const { email, password, username, apellido, dni, domicilio, celular } =
		req.body;

	try {
		const userFound = await User.findOne({ email });
		if (userFound)
			return res.status(400).json(['El email ya esta registrado!']);

		// encripta el password (bcrypt instalado)
		const passwordHash = await bcrypt.hash(password, 10);

		// crea nuevo usuario en DB
		const newUser = new User({
			username,
			email,
			password: passwordHash,
			apellido,
			dni,
			domicilio,
			celular,
		});

		// lo guarda en DB
		const userSaved = await newUser.save();

		// crea el token
		const token = await createAccessToken({ id: userSaved._id });

		res.cookie('token', token);

		// envia respuesta del registro al frontend
		res.json({
			id: userSaved._id,
			email: userSaved.email,
			createdAt: userSaved.createdAt,
		});
	} catch (error) {
		return res.status(500).json(['Error de registro de usuario']);
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const userFound = await User.findOne({ email });

		// Validacion usuario y contraseña por backend
		if (!userFound)
			return res.status(400).json({
				message: ['El email ingresado no existe'],
			});

		const isMatch = await bcrypt.compare(password, userFound.password);
		if (!isMatch)
			return res.status(400).json({
				message: ['La contraseña ingresada es incorrecta'],
			});

		// genera el token
		const token = await createAccessToken({ id: userFound._id });

		res.cookie('token', token);

		// envia respuesta al frontend
		res.json({
			id: userFound._id,
			email: userFound.email,
			createdAt: userFound.createdAt,
		});
	} catch (error) {
		return res.status(500).json(['Error de registro de usuario']);
	}
};

export const logout = (req, res) => {
	res.cookie('token', '', { expires: new Date(0) });
	return res.sendStatus(200);
};

export const profile = async (req, res) => {
	const userFound = await User.findById(req.user.id);
	if (!userFound) return res.status(400).json(['Usuario no encontrado']);

	return res.json({
		id: userFound._id,
		email: userFound.email,
		createdAt: userFound.createdAt,
	});
};

export const verifyToken = async (req, res) => {
	const { token } = req.cookies;

	if (!token) return res.send(false);

	Jwt.verify(token, TOKEN_SECRET, async (error, user) => {
		if (error) return res.status(401).json(['No autorizado']);

		const userFound = await User.findById(user.id);

		if (!userFound) return res.status(401).json(['No autorizado']);

		return res.json({
			id: userFound._id,
			email: userFound.email,
		});
	});
};
