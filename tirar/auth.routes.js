import { Router } from 'express';
import {
	login,
	register,
	logout,
	profile,
	verifyToken,
} from '../src/controllers/auth.controller.js';
import { authRequired } from '../src/middlewares/validateToken.js';
import { validateSchema } from '../src/middlewares/validator.Middleware.js';
import { registerSchema, loginSchema } from '../src/schemas/auth.Schema.js';
import { config } from 'dotenv';

config();
const router = Router();

router.post('/register', validateSchema(registerSchema), register);
router.post('/login', validateSchema(loginSchema), login);
router.post('/logout', verifyToken, logout);
router.get('/verify', verifyToken);
router.get('/profile', authRequired, profile);

export default router;
