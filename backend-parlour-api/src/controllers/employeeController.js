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
exports.deleteEmployee = exports.updateEmployee = exports.addEmployee = exports.getEmployees = void 0;
const Employee_1 = __importDefault(require("../models/Employee"));
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield Employee_1.default.find();
        res.json(employees);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getEmployees = getEmployees;
const addEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role } = req.body;
        const exists = yield Employee_1.default.findOne({ email });
        if (exists) {
            res.status(400).json({ message: 'Employee already exists' });
            return;
        }
        const employee = yield Employee_1.default.create({ name, email, role });
        res.status(201).json(employee);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.addEmployee = addEmployee;
const updateEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        const employee = yield Employee_1.default.findByIdAndUpdate(id, { name, email, role }, { new: true });
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        res.json(employee);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const employee = yield Employee_1.default.findByIdAndDelete(id);
        if (!employee) {
            res.status(404).json({ message: 'Employee not found' });
            return;
        }
        res.json({ message: 'Employee deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteEmployee = deleteEmployee;
