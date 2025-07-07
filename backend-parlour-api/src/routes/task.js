"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', auth_1.authenticateJWT, taskController_1.getTasks);
router.post('/', auth_1.authenticateJWT, taskController_1.addTask);
router.put('/:id', auth_1.authenticateJWT, taskController_1.updateTask);
router.delete('/:id', auth_1.authenticateJWT, taskController_1.deleteTask);
exports.default = router;
