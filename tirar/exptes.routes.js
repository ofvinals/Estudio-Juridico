import { Router } from 'express';
import { authRequired } from '../src/middlewares/validateToken.js';
import {
	getExptes,
	getExpte,
	createExpte,
	deleteExpte,
	updateExpte,
	createMov,
	deleteMov,
} from '../src/controllers/expte.controller.js';
import { validateSchema } from '../src/middlewares/validator.Middleware.js';
import { createExpteSchema } from '../src/schemas/expte.Schema.js';
import {upload} from '../src/controllers/upload.controller.js'

const router = Router();

router.get('/exptes', authRequired, getExptes);
router.get('/exptes/:id', authRequired, getExpte);
router.post(
	'/exptes',
	upload.single('file'),
	authRequired,
	validateSchema(createExpteSchema),
	createExpte
);
router.delete('/exptes/:id', authRequired, deleteExpte);
router.put('/exptes/:id', authRequired, updateExpte);

router.post('/exptes/:id/movimientos', authRequired, createMov);

router.delete('/exptes/:expedienteId/movimientos/:movimientoId', authRequired, deleteMov);

export default router;
