import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getCajas,
	getCaja,
	createCaja,
	deleteCaja,
	updateCaja,
} from '../controllers/caja.controller.js';
// import { validateSchema } from '../middlewares/validator.Middleware.js';
import {upload} from '../controllers/upload.controller.js'

const router = Router();

router.get('/cajas', authRequired, getCajas);
router.get('/cajas/:id', authRequired, getCaja);
router.post(
	'/cajas',
	upload.single('file'),
	authRequired,
	createCaja
);
router.delete('/cajas/:id', authRequired, deleteCaja);
router.put('/cajas/:id', authRequired, updateCaja);

export default router;
