import express from 'express';
import morgan from 'morgan';
import authRoutes from '../tirar/routes/auth.routes.js';
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

app.use(cookieParser());

app.use(morgan('dev'));

app.use(express.json());


app.use('/api', authRoutes);


