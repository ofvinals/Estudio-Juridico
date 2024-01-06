import mongoose from 'mongoose';

const expteSchema = new mongoose.Schema(
	{
		cliente: {
			type: String,
			// require: true,
		},
		nroexpte: {
			type: String,
			require: true,
		},
		radicacion: {
			type: String,
			require: true,
		},
		juzgado: {
			type: String,
			require: true,
		},
		actor: {
			type: String,
			require: true,
		},
		demandado: {
			type: String,
			require: true,
		},
		proceso: {
			type: String,
			require: true,
		},
		caratula: {
			type: String,
		},
		estado: {
			type: String,
			require: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			require: true,
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model('Expte', expteSchema);
