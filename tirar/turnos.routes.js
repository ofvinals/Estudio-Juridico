import { Router } from 'express';
import { authRequired } from '../src/middlewares/validateToken.js';
import {
	getTurnos,
	getTurno,
	createTurno,
	deleteTurno,
	updateTurno,
} from '../src/controllers/turno.controller.js';
import { validateSchema } from '../src/middlewares/validator.Middleware.js';

const router = Router();

router.get('/turnos', authRequired, getTurnos);
router.get('/turnos/:id', authRequired, getTurno);
router.post('/turnos', authRequired, createTurno);
router.delete('/turnos/:id', authRequired, deleteTurno);
router.put('/turnos/:id', authRequired, updateTurno);

export default router;
