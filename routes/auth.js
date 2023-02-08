import express from 'express';
import { login } from '../controllers/auth.js';

const router = express.Router();
router.route('/').get();

router.post('/login', login);

export default router;
