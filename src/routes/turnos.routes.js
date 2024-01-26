import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getTurnos,
	getTurno,
	createTurno,
	deleteTurno,
	updateTurno,
} from '../controllers/turno.controller.js';
import { validateSchema } from '../middlewares/validator.Middleware.js';

const router = Router();

router.get('/turnos', authRequired, getTurnos);
router.get('/turnos/:id', authRequired, getTurno);
router.post('/turnos', authRequired, createTurno);
router.delete('/turnos/:id', authRequired, deleteTurno);
router.put('/turnos/:id', authRequired, updateTurno);

export default router;
