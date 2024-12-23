import { Router } from 'express';
const router = Router();
import { getOrders, getOrderById, getOrderByUserId, createOrder, updateOrder, deleteOrder } from '../db/orderqueries';

router.get('/', getOrders)
router.get('/:id', getOrderById)
router.get('/mine', getOrderByUserId)
router.post('/mine/create', createOrder)
router.put('/:id', updateOrder)
router.delete('/:id', deleteOrder)

export default router;