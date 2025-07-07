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
exports.deleteTask = exports.updateTask = exports.addTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const Employee_1 = __importDefault(require("../models/Employee"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield Task_1.default.find().populate('assignedTo', 'name email role');
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getTasks = getTasks;
const addTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'superadmin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    try {
        const { title, description, assignedTo, status } = req.body;
        const employee = yield Employee_1.default.findById(assignedTo);
        if (!employee) {
            res.status(400).json({ message: 'Assigned employee not found' });
            return;
        }
        const task = yield Task_1.default.create({ title, description, assignedTo, status });
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addTask = addTask;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'superadmin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    try {
        const { id } = req.params;
        const { title, description, assignedTo, status } = req.body;
        const task = yield Task_1.default.findByIdAndUpdate(id, { title, description, assignedTo, status }, { new: true });
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'superadmin') {
        res.status(403).json({ message: 'Forbidden' });
        return;
    }
    try {
        const { id } = req.params;
        const task = yield Task_1.default.findByIdAndDelete(id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteTask = deleteTask;
