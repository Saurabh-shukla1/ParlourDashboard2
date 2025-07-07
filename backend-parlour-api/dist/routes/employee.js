"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employeeController_1 = require("../controllers/employeeController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateJWT, employeeController_1.getEmployees);
router.post('/', auth_1.authenticateJWT, employeeController_1.addEmployee);
router.put('/:id', auth_1.authenticateJWT, employeeController_1.updateEmployee);
router.delete('/:id', auth_1.authenticateJWT, employeeController_1.deleteEmployee);
exports.default = router;
