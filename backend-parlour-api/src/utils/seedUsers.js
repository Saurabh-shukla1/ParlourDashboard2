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
const User_1 = __importDefault(require("../models/User"));
const hash_1 = require("./hash");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || '';
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGODB_URI);
        const users = [
            {
                name: 'Super Admin',
                email: 'superadmin@parlour.com',
                password: yield (0, hash_1.hashPassword)('superadmin123'),
                role: 'superadmin',
            },
            {
                name: 'Admin User',
                email: 'admin@parlour.com',
                password: yield (0, hash_1.hashPassword)('admin123'),
                role: 'admin',
            },
        ];
        for (const user of users) {
            const exists = yield User_1.default.findOne({ email: user.email });
            if (!exists) {
                yield User_1.default.create(user);
                console.log(`Created user: ${user.email}`);
            }
            else {
                console.log(`User already exists: ${user.email}`);
            }
        }
        yield mongoose_1.default.disconnect();
        console.log('Seeding complete.');
    });
}
seed().catch((err) => {
    console.error('Seeding error:', err);
    mongoose_1.default.disconnect();
});
