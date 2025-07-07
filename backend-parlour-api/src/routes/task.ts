import express from 'express';
import { getTasks, addTask, updateTask, deleteTask } from '../controllers/taskController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticateJWT, getTasks);
router.post('/', authenticateJWT, addTask);
router.put('/:id', authenticateJWT, updateTask);
router.delete('/:id', authenticateJWT, deleteTask);

export default router; 