import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.post('/', controller.upload, contoller.uploadfile);

export default router;
