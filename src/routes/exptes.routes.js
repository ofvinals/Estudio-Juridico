import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getExptes,
	getExpte,
	createExpte,
	deleteExpte,
	updateExpte,
	createMov,
	deleteMov,
} from '../controllers/expte.controller.js';
import { validateSchema } from '../middlewares/validator.Middleware.js';
import { createExpteSchema } from '../schemas/expte.Schema.js';


const router = Router();

router.get('/exptes', authRequired, getExptes);
router.get('/exptes/:id', authRequired, getExpte);
router.post(
	'/exptes',
	authRequired,
	validateSchema(createExpteSchema),
	createExpte
);
router.delete('/exptes/:id', authRequired, deleteExpte);
router.put('/exptes/:id', authRequired, updateExpte);

router.post('/exptes/:id/movimientos', authRequired, createMov);

router.delete('/exptes/:expedienteId/movimientos/:movimientoId', authRequired, deleteMov);

export default router;
