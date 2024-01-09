import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		await mongoose.connect(`mongodb://localhost/Estudiodb`, {});
		console.log('MongoDB is connected');
	} catch (error) {
		console.error(error);
	}
};
