import express from 'express';
import morgan from 'morgan';
import authRoutes from '../src/routes/auth.routes';
import cookieParser from 'cookie-parser';
import authRoutes from '../src/routes/auth.routes'
import exptesRoutes from '../src/routes/exptes.routes'
import usersRoutes from '../src/routes/users.routes'

const express = require("express");

const app = express();

app.use(cors({
   origin: 'http://localhost:5173/',
   credentials: true
}));

app.use(morgan('dev'));

app.use(authRoutes);

app.use(exptesRoutes);

app.use(usersRoutes)

app.use(cookieParser());

app.use('/api', authRoutes);

app.use('/api', exptesRoutes);

app.use('/api', usersRoutes)

export default app;
