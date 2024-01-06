import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import {
	getUsers,
	getUser,
	createUser,
	deleteUser,
	updateUser,
} from '../controllers/user.controller.js';
import { validateSchema } from '../middlewares/validator.Middleware.js';

const router = Router();

router.get('/users', authRequired, getUsers);
router.get('/users/:id', authRequired, getUser);
router.post(
	'/users',
	authRequired,
	
	createUser
);
router.delete('/users/:id', authRequired, deleteUser);
router.put('/users/:id', authRequired, updateUser);

export default router;
