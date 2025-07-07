import express from 'express';
import { getAttendance, punch } from '../controllers/attendanceController';
import { authenticateJWT } from '../middlewares/auth';

const router = express.Router();

router.get('/', authenticateJWT, getAttendance);
router.post('/punch', authenticateJWT, punch);

export default router; 