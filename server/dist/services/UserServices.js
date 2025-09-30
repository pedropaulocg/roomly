"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserServices {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository_1.UserRepository();
    }
    async createUser(user) {
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
        return this.userRepository.create({ ...user, password: hashedPassword });
    }
    async getAllUsers() {
        return this.userRepository.findAll();
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async updateUser(id, user) {
        return this.userRepository.update(id, user);
    }
    async deleteUser(id) {
        await this.userRepository.delete(id);
    }
}
exports.UserServices = UserServices;
