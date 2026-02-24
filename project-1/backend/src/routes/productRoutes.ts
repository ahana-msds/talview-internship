import { Router } from 'express';
import {
    getProducts,
    getProductById,
    getCategories,
    searchProducts,
    getProductsByCategory,
    updateProductStock
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/:id', getProductById);
router.put('/:id/stock', authenticateToken, updateProductStock);

export default router;
