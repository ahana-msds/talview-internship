import { Router } from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

// Cart SHOULD ideally be protected but currently supports guest via header fallback in controller.
// Applying authMiddleware to populate req.user if token exists, but not strictly requiring it 
// unless we want to force login for cart. 
// For this stage, we'll apply it but the middleware typically sends 401 if missing.
// To support guests, we might need a "soft" auth middleware. 
// For now, let's keep it open or make middleware optional?
// The user request didn't specify strict cart auth, but let's assume secure by default for new MVC.
// However, the controller logic has `|| 'guest'` fallback, so we probably shouldn't block at middleware level if we want guest carts.
// Let's make a "soft" auth middleware or just use it on specific routes.
// Actually, `authenticateToken` sends 401 if no token.
// So guests won't work if we use `authenticateToken`.
// Let's Use `authenticateToken` for now as requested "JWT generation... sends tokens".

router.get('/', authenticateToken, getCart);
router.post('/', authenticateToken, addToCart);
router.patch('/:productId', authenticateToken, updateCartItem);
router.delete('/:productId', authenticateToken, removeCartItem);
router.delete('/', authenticateToken, clearCart);

export default router;
