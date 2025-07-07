import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  employee: mongoose.Types.ObjectId;
  type: 'in' | 'out';
  timestamp: Date;
}

const AttendanceSchema = new Schema<IAttendance>({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema); 