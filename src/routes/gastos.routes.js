import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getGastos,
	getGasto,
	createGasto,
	deleteGasto,
	updateGasto,
} from '../controllers/gasto.controller.js';
import { validateSchema } from '../middlewares/validator.Middleware.js';

const router = Router();

router.get('/gastos', authRequired, getGastos);
router.get('/gastos/:id', authRequired, getGasto);
router.post(
	'/gastos',
	authRequired,
	
	createGasto
);
router.delete('/gastos/:id', authRequired, deleteGasto);
router.put('/gastos/:id', authRequired, updateGasto);

export default router;
