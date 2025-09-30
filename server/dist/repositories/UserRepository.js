"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../config/prisma");
class UserRepository {
    async create(user) {
        return prisma_1.prisma.user.create({ data: user, include: { rooms: true, reservations: true } });
    }
    async findAll() {
        return prisma_1.prisma.user.findMany({ include: { rooms: true, reservations: true } });
    }
    async findById(id) {
        return prisma_1.prisma.user.findUnique({ where: { id }, include: { rooms: true, reservations: true } });
    }
    async findByEmail(email) {
        return prisma_1.prisma.user.findUnique({ where: { email }, include: { rooms: true, reservations: true } });
    }
    async update(id, user) {
        return prisma_1.prisma.user.update({ where: { id }, data: user, include: { rooms: true, reservations: true } });
    }
    async delete(id) {
        await prisma_1.prisma.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
