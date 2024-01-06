import mongoose from 'mongoose';
import { date } from 'zod';

const gastoSchema = new mongoose.Schema(
	{
		nroexpte: {
			type: String,
			required: true,
			unique:true,
		},
		// caratula: {
		// 	type: String,
		// 	required: true,
		// },
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
