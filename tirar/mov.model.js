import mongoose from 'mongoose';

const movSchema = new mongoose.Schema(
	{
		nroexpte: {
			type: String,
			require: true,
		},
		fecha: {
			type: String,
			require: true,
		},
		descripcion: {
			type: String,
			require: true,
		},
		adjunto: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

