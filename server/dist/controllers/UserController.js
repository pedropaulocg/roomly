"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserServices_1 = require("../services/UserServices");
class UserController {
    userServices;
    constructor() {
        this.userServices = new UserServices_1.UserServices();
    }
    async createUser(req, res) {
        const { name, email, password, role } = req.body;
        const user = await this.userServices.createUser({
            name,
            email,
            password,
            role,
        });
        res.status(201).json(user);
    }
    async getAllUsers(req, res) {
        const users = await this.userServices.getAllUsers();
        res.status(200).json(users);
    }
    async getUserById(req, res) {
        const { id } = req.params;
        const user = await this.userServices.getUserById(Number(id));
        res.status(200).json(user);
    }
    async updateUser(req, res) {
        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const user = await this.userServices.updateUser(Number(id), {
            name,
            email,
            password,
            role,
        });
        res.status(200).json(user);
    }
    async deleteUser(req, res) {
        const { id } = req.params;
        await this.userServices.deleteUser(Number(id));
        res.status(200).json({ message: "User deleted successfully" });
    }
}
exports.UserController = UserController;
