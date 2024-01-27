import mongoose from 'mongoose';
import { date } from 'zod';

const turnoSchema = new mongoose.Schema(
	{
		turno: {
			type: String,
			required: true,
			unique:true,
		},
		email: {
			type: String,
			required: true,
		},
		motivo: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Turno', turnoSchema);
