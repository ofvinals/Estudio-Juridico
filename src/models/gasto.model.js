import mongoose from 'mongoose';

const gastoSchema = new mongoose.Schema(
	{
		nroexpte: {
			type: String,
			required: true,
			index: false,
					},
		caratula: {
			type: String,
			required: true
		},
		concepto: {
			type: String,
			required: true,
		},
		comprobante: {
			type: String,

		},		
		monto: {
			type: String,
			required: true,
		},
		estado: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Gasto', gastoSchema);
