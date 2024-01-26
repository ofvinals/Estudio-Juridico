import mongoose from 'mongoose';

const expteSchema = new mongoose.Schema(
	{
		cliente: {
			type: String,
			require: true,
		},
		nroexpte: {
			type: String,
			require: true,
			unique: true
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

		movimientos: [
			{
				fecha: {
					type: String,
					require: true,
				},
				descripcion: {
					type: String,
					require: true,
				},
				file: {
					type: mongoose.Schema.Types.Mixed,
					filename: String,
					filePath: String,
				},
				url:{
					type: String,
				},
			},
		], 
	},

	{
		timestamps: true,
	}
);

expteSchema.methods.setFile = function setFile(
	filename,
	filePath
) {
	this.file = {
		filename: filename,
		filePath: filePath,
	};
};

export default mongoose.model('Expte', expteSchema);

