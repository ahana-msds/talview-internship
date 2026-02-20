import { Router } from 'express';
import {
    getProducts,
    getProductById,
    getCategories,
    searchProducts,
    getProductsByCategory
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/category/:slug', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
