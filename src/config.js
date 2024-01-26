import dotenv from 'dotenv';
dotenv.config();

export const CLOUDINARY_NAME = process.env['CLOUDINARY_NAME'];
export const CLOUDINARY_KEY = process.env['CLOUDINARY_KEY'];
export const CLOUDINARY_SECRET = process.env['CLOUDINARY_SECRET'];

export const PORT = 4000;
export const MONGODB_URI ="mongodb+srv://ofvinals:estudio620@cluster0.u0gqupb.mongodb.net/";
export const TOKEN_SECRET = 'secret';

export const FRONTEND_URL = process.env.FRONTEND_URL;


