import express from 'express';
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.routes.js';
import exptesRoutes from '../src/routes/exptes.routes.js';
import usersRoutes from '../src/routes/users.routes.js';
import turnosRoutes from '../src/routes/turnos.routes.js';
import gastosRoutes from '../src/routes/gastos.routes.js';
import cajasRoutes from '../src/routes/cajas.routes.js';
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();


// const fs = require('node:fs');
// const upload = multer({
// 	dest: 'uploads',
// });

// app.post('/archive/single', upload.single('imagenperf'), (req, res) => {
// 	console.log(req.file);
// 	saveArchive(req.file);
// 	res.send('termina');
// });

// function saveArchive(file) {
// 	const newPath = `uploads/${file.originalname}`;
// 	fs.renameSync(file.path, newPath);
// }

app.use(
	cors({
		origin: ['http://localhost:5173', 'https://flourishing-tanuki-55bdc2.netlify.app'], 
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.use(cookieParser());

app.use(morgan('combined'));

app.use(express.json());

app.use('/api', usersRoutes);

app.use('/api', gastosRoutes);

app.use('/api', turnosRoutes);

app.use('/api', authRoutes);

app.use('/api', exptesRoutes);

app.use('/api', cajasRoutes);

async function main() {
	try {
		await connectDB();
		console.log(`Server listening on`, 4000);
		app.listen(4000);
	} catch (error) {
		console.error(error);
	}
}

main();
