import mongoose from 'mongoose';

const cajaSchema = new mongoose.Schema(
	{
		fecha: {
			type: Date,
			require: true,
		},
		concepto: {
			type: String,
			require: true,
		},
		tipo: {
			type: String,
			require: true,
		},
		monto: {
			type: String,
			require: true,
		},
		adjunto: {
			type: String,
		},
		estado: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model('Caja', cajaSchema);
