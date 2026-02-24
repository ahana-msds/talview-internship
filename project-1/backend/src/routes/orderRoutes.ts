import { Router } from 'express';
import { startOrder, getOrders, getOrderById, signalOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = Router();

// Protect order creation and listing
router.post('/start', authenticateToken, startOrder);
router.get('/', authenticateToken, getOrders);
router.get('/:id', getOrderById); // Maybe public or protected? Keeping public for easier checking for now
router.post('/:id/signal/:signalName', authenticateToken, signalOrder);

export default router;
