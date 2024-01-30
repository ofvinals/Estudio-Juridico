import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.routes.js';
import googleRoutes from '../src/routes/google.routes.js';
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

	next();
});

app.use(cookieParser());

app.use(morgan('dev'));

app.use(express.json());

app.use('/api', googleRoutes);

app.use('/api', authRoutes);

// async function main() {
// 	try {
// 		await connectDB();
// 		console.log(`Server listening on`, 4000);
// 		app.listen(4000);
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

// main();
