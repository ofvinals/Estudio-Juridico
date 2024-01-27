import { Router } from 'express';
import { authRequired } from '../src/middlewares/validateToken.js';
import {
	getGastos,
	getGasto,
	createGasto,
	deleteGasto,
	updateGasto,
} from '../src/controllers/gasto.controller.js';
import { validateSchema } from '../src/middlewares/validator.Middleware.js';
import { upload } from '../src/controllers/upload.controller.js';

const router = Router();

router.get('/gastos', authRequired, getGastos);
router.get('/gastos/:id', authRequired, getGasto);
router.post(
	'/gastos',
	upload.single('file'),
	authRequired,
	createGasto
);
router.delete('/gastos/:id', authRequired, deleteGasto);
router.put('/gastos/:id', authRequired, updateGasto);

export default router;
