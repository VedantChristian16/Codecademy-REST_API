import { Router } from 'express';
const router = Router();
import { getCartByUserId, createCart, getCartById } from '../db/cartqueries';
import { getCartItemsByCartId, createCartItem, updateCartItem, deleteCartItem } from '../db/cartitemqueries';
 
router.get('/mine', getCartByUserId)
router.get('/mine/create', createCart)
router.get('/:id',getCartById)
router.get('/mine/items', getCartItemsByCartId)
router.post('/mine/items', createCartItem)
router.put('/:id', updateCartItem)
router.delete('/:id',deleteCartItem)

export default router;