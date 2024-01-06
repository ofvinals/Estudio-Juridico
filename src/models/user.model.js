import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		apellido: {
			type: String,
		},
		dni: {
			type: String,
			required: true,
		},
		domicilio: {
			type: String,
			required: true,
		},
		celular: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('User', userSchema);
