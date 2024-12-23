import { Router } from 'express';
const router = Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../db/productqueries';

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)

export default router;