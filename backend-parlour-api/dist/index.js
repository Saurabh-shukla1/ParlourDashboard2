"use strict";
"console.log('Backend API running');";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const employee_1 = __importDefault(require("./routes/employee"));
const task_1 = __importDefault(require("./routes/task"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const attendance_1 = __importDefault(require("./routes/attendance"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';
// MongoDB connection
mongoose_1.default.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/auth', auth_1.default);
app.use('/api/employees', employee_1.default);
app.use('/api/tasks', task_1.default);
app.use('/api/attendance', attendance_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
app.set('io', io);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
