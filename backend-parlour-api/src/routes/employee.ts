import express from 'express';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticateJWT, getEmployees);
router.post('/', authenticateJWT, addEmployee);
router.put('/:id', authenticateJWT, updateEmployee);
router.delete('/:id', authenticateJWT, deleteEmployee);

export default router; 