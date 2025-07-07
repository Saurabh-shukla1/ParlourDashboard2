import { Request, Response } from 'express';
import Employee from '../models/Employee';

export const getEmployees = async (req: Request, res: Response): Promise<void> => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, role } = req.body;
    const exists = await Employee.findOne({ email });
    if (exists) {
      res.status(400).json({ message: 'Employee already exists' });
      return;
    }
    const employee = await Employee.create({ name, email, role });
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEmployee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      res.status(404).json({ message: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 