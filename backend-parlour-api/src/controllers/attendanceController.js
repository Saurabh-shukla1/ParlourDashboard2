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
exports.punch = exports.getAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Employee_1 = __importDefault(require("../models/Employee"));
const getAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield Attendance_1.default.find().populate('employee', 'name email role').sort({ timestamp: -1 });
        res.json(logs);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAttendance = getAttendance;
const punch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employeeId, type } = req.body;
        if (!['in', 'out'].includes(type)) {
            res.status(400).json({ message: 'Invalid punch type' });
            return;
        }
        const employee = yield Employee_1.default.findById(employeeId);
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        const log = yield Attendance_1.default.create({ employee: employeeId, type });
        // Emit WebSocket event
        const io = req.app.get('io');
        if (io) {
            io.emit('attendance_update', { log });
        }
        res.status(201).json(log);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.punch = punch;
