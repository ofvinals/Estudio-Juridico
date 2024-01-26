import express from 'express';
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.routes.js';
import exptesRoutes from '../src/routes/exptes.routes.js';
import usersRoutes from '../src/routes/users.routes.js';
import turnosRoutes from '../src/routes/turnos.routes.js';
import gastosRoutes from '../src/routes/gastos.routes.js';
import cajasRoutes from '../src/routes/cajas.routes.js';
import googleRoutes from '../src/routes/google.routes.js';
import { connectDB } from './db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
	cors({
		origin: [
			'http://localhost:5173',
			'https://flourishing-tanuki-55bdc2.netlify.app',
			'http://localhost:5174',
			'*',
		],
		credentials: true,
		optionsSuccessStatus: 200,
	})
);

app.use((req, res, next) => {
	// Configuración de COOP: same-origin y same-origin-allow-popups
	res.setHeader('Cross-Origin-Opener-Policy: restrict-properties');

	// Configuración de COEP: same-origin
	res.setHeader('Cross-Origin-Embedder-Policy: require-corp');

	// Continuar con el siguiente middleware
	next();
});

app.use(cookieParser());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', googleRoutes);

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
