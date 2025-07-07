import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Attendance from '../models/Attendance';
import Employee from '../models/Employee';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const employees = await Employee.find();
  if (employees.length === 0) {
    console.log('No employees found. Seed employees first.');
    await mongoose.disconnect();
    return;
  }

  const logs = [
    { employee: employees[0]._id, type: 'in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5) },
    { employee: employees[0]._id, type: 'out', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
    { employee: employees[1]._id, type: 'in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) },
    { employee: employees[1]._id, type: 'out', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { employee: employees[2]._id, type: 'in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
    { employee: employees[3]._id, type: 'in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { employee: employees[3]._id, type: 'out', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
    { employee: employees[4]._id, type: 'in', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  ];

  for (const log of logs) {
    await Attendance.create(log);
    console.log(`Created attendance log for employee: ${log.employee} (${log.type})`);
  }

  await mongoose.disconnect();
  console.log('Attendance seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 