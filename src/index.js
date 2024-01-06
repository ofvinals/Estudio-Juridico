import express from 'express';
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.routes.js';
import exptesRoutes from '../src/routes/exptes.routes.js';
import usersRoutes from '../src/routes/users.routes.js'
import turnosRoutes from '../src/routes/turnos.routes.js'
import gastosRoutes from '../src/routes/gastos.routes.js'
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
	cors({
		origin: [`http://localhost:5173`, 'https://flourishing-tanuki-55bdc2.netlify.app'],
		credentials: true,
		optionsSuccessStatus: 200, 
	})
);

connectDB();

app.use(cookieParser());

app.use(morgan('start'));

app.use(express.json());

app.use('/api', usersRoutes);

app.use('/api', gastosRoutes);

app.use('/api', turnosRoutes);

app.use('/api', authRoutes);

app.use('/api', exptesRoutes);

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
