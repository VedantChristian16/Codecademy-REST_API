import { Router } from 'express';
const router = Router();
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../db/userqueries';

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/register', createUser)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router;