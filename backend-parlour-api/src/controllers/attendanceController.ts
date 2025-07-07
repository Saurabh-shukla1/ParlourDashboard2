import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

export const getAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await Attendance.find().populate('employee', 'name email role').sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const punch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employeeId, type } = req.body;
    if (!['in', 'out'].includes(type)) {
      res.status(400).json({ message: 'Invalid punch type' });
      return;
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    const log = await Attendance.create({ employee: employeeId, type });
    // Emit WebSocket event
    const io = req.app.get('io');
    if (io) {
      io.emit('attendance_update', { log });
    }
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 