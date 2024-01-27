import mongoose from 'mongoose';

const cajaSchema = new mongoose.Schema(
	{
		fecha: {
			type: String,
			require: true,
		},
		mes: {
			type: String,
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
			type: Number,
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
		estado: {
			type: String,
			require: true,
		},
	},
	{
		timestamps: true,
	}
);

cajaSchema.methods.setFile = function setFile(
	filename,
	filePath
) {
	this.file = {
		filename: filename,
		filePath: filePath,
	};
};

export default mongoose.model('Caja', cajaSchema);
