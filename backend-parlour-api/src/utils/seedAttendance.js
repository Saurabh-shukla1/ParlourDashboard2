"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Employee_1 = __importDefault(require("../models/Employee"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || '';
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGODB_URI);
        const employees = yield Employee_1.default.find();
        if (employees.length === 0) {
            console.log('No employees found. Seed employees first.');
            yield mongoose_1.default.disconnect();
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
            yield Attendance_1.default.create(log);
            console.log(`Created attendance log for employee: ${log.employee} (${log.type})`);
        }
        yield mongoose_1.default.disconnect();
        console.log('Attendance seeding complete.');
    });
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    mongoose_1.default.disconnect();
});
