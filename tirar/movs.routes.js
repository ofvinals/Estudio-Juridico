import { Router } from 'express';
import { authRequired } from '../src/middlewares/validateToken.js';
import {
	getMovs,
	getMov,
	createMov,
	deleteMov,
	updateMov,
} from '../src/controllers/expte.controller.js';
import { validateSchema } from '../src/middlewares/validator.Middleware.js';

const router = Router();

router.get('/movs', authRequired, getMovs);
router.get('/movs/:id', authRequired, getMov);
router.post(
	'/movs',
	authRequired,
	createMov
);
router.delete('/movs/:id', authRequired, deleteMov);
router.put('/movs/:id', authRequired, updateMov);

export default router;
