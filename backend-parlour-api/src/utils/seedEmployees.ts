import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Employee from '../models/Employee';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const employees = [
    { name: 'Alice Johnson', email: 'alice@parlour.com', role: 'stylist' },
    { name: 'Bob Smith', email: 'bob@parlour.com', role: 'receptionist' },
    { name: 'Carol Lee', email: 'carol@parlour.com', role: 'manager' },
    { name: 'David Kim', email: 'david@parlour.com', role: 'stylist' },
    { name: 'Eva Brown', email: 'eva@parlour.com', role: 'cleaner' },
  ];

  for (const emp of employees) {
    const exists = await Employee.findOne({ email: emp.email });
    if (!exists) {
      await Employee.create(emp);
      console.log(`Created employee: ${emp.email}`);
    } else {
      console.log(`Employee already exists: ${emp.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Employee seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 