import { Router } from 'express';
import { createRequest, getRequests } from '../controllers/requestController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/flag', authenticateToken, createRequest);
router.get('/', authenticateToken, getRequests);

export default router;
