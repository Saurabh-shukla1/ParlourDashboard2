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
const Task_1 = __importDefault(require("../models/Task"));
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
            yield Task_1.default.create(task);
            console.log(`Created task: ${task.title}`);
        }
        yield mongoose_1.default.disconnect();
        console.log('Task seeding complete.');
    });
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    mongoose_1.default.disconnect();
});
