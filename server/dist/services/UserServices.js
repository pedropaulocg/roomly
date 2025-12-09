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
    async getUserById(id, options) {
        const user = await this.userRepository.findById(id, options);
        // Se useSelect não foi usado e temos relacionamentos, serializar para remover referências circulares
        if (user && !options?.useSelect && (options?.includeRooms || options?.includeReservations)) {
            return JSON.parse(JSON.stringify(user, (key, value) => {
                // Remover referências circulares
                if (key === 'owner' && value?.rooms) {
                    return { id: value.id, name: value.name };
                }
                if (key === 'client' && value?.reservations) {
                    return { id: value.id, name: value.name };
                }
                if (key === 'room' && value?.reservations) {
                    return { id: value.id, name: value.name };
                }
                return value;
            }));
        }
        return user;
    }
    async updateUser(id, user) {
        return this.userRepository.update(id, user);
    }
    async deleteUser(id) {
        await this.userRepository.delete(id);
    }
}
exports.UserServices = UserServices;
