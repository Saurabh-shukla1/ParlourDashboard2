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
const Employee_1 = __importDefault(require("../models/Employee"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || '';
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGODB_URI);
        const employees = [
            { name: 'Alice Johnson', email: 'alice@parlour.com', role: 'stylist' },
            { name: 'Bob Smith', email: 'bob@parlour.com', role: 'receptionist' },
            { name: 'Carol Lee', email: 'carol@parlour.com', role: 'manager' },
            { name: 'David Kim', email: 'david@parlour.com', role: 'stylist' },
            { name: 'Eva Brown', email: 'eva@parlour.com', role: 'cleaner' },
        ];
        for (const emp of employees) {
            const exists = yield Employee_1.default.findOne({ email: emp.email });
            if (!exists) {
                yield Employee_1.default.create(emp);
                console.log(`Created employee: ${emp.email}`);
            }
            else {
                console.log(`Employee already exists: ${emp.email}`);
            }
        }
        yield mongoose_1.default.disconnect();
        console.log('Employee seeding complete.');
    });
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    mongoose_1.default.disconnect();
});
