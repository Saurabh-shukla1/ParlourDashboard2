import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from '../models/Task';
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

  const tasks = [
    {
      title: 'Prepare Inventory Report',
      description: 'Compile and submit the monthly inventory report.',
      assignedTo: employees[0]._id,
      status: 'pending',
    },
    {
      title: 'Reception Desk Duty',
      description: 'Manage the reception desk for the morning shift.',
      assignedTo: employees[1 % employees.length]._id,
      status: 'in progress',
    },
    {
      title: 'Salon Cleaning',
      description: 'Deep clean the salon area after closing.',
      assignedTo: employees[4 % employees.length]._id,
      status: 'pending',
    },
    {
      title: 'Client Follow-up',
      description: 'Call clients for feedback and follow-up.',
      assignedTo: employees[2 % employees.length]._id,
      status: 'completed',
    },
    {
      title: 'Hair Styling Workshop',
      description: 'Attend the advanced hair styling workshop.',
      assignedTo: employees[3 % employees.length]._id,
      status: 'pending',
    },
  ];

  for (const task of tasks) {
    await Task.create(task);
    console.log(`Created task: ${task.title}`);
  }

  await mongoose.disconnect();
  console.log('Task seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 