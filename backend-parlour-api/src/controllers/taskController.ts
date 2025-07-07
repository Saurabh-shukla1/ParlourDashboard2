import { Request, Response } from 'express';
import Task from '../models/Task';
import Employee from '../models/Employee';

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'name email role');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addTask = async (req: any, res: Response): Promise<void> => {
  if (req.user?.role !== 'superadmin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  try {
    const { title, description, assignedTo, status } = req.body;
    const employee = await Employee.findById(assignedTo);
    if (!employee) {
      res.status(400).json({ message: 'Assigned employee not found' });
      return;
    }
    const task = await Task.create({ title, description, assignedTo, status });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: any, res: Response): Promise<void> => {
  if (req.user?.role !== 'superadmin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  try {
    const { id } = req.params;
    const { title, description, assignedTo, status } = req.body;
    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, assignedTo, status },
      { new: true }
    );
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: any, res: Response): Promise<void> => {
  if (req.user?.role !== 'superadmin') {
    res.status(403).json({ message: 'Forbidden' });
    return;
  }
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 