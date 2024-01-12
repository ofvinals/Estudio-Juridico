import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://ofvinals:estudio620@cluster0.u0gqupb.mongodb.net/");
		console.log('MongoDB is connected at Atlas');
	} catch (error) {
		console.error(error);
	}
};
