import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import { hashPassword } from './hash';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const users = [
    {
      name: 'Super Admin',
      email: 'superadmin@parlour.com',
      password: await hashPassword('superadmin123'),
      role: 'superadmin',
    },
    {
      name: 'Admin User',
      email: 'admin@parlour.com',
      password: await hashPassword('admin123'),
      role: 'admin',
    },
  ];

  for (const user of users) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      await User.create(user);
      console.log(`Created user: ${user.email}`);
    } else {
      console.log(`User already exists: ${user.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete.');
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  mongoose.disconnect();
}); 