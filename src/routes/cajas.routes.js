import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getCajas,
	getCaja,
	createCaja,
	deleteCaja,
	updateCaja,
} from '../controllers/caja.controller.js';
import { validateSchema } from '../middlewares/validator.Middleware.js';

const router = Router();

router.get('/cajas', authRequired, getCajas);
router.get('/cajas/:id', authRequired, getCaja);
router.post(
	'/cajas',
	authRequired,
	createCaja
);
router.delete('/cajas/:id', authRequired, deleteCaja);
router.put('/cajas/:id', authRequired, updateCaja);

export default router;
