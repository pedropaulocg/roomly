"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRepository = void 0;
const prisma_1 = require("../config/prisma");
class RoomRepository {
    async create(room) {
        return prisma_1.prisma.room.create({ data: room });
    }
    async findAll() {
        return prisma_1.prisma.room.findMany();
    }
    async findById(id) {
        return prisma_1.prisma.room.findUnique({ where: { id } });
    }
    async update(id, room) {
        return prisma_1.prisma.room.update({ where: { id }, data: room });
    }
    async delete(id) {
        await prisma_1.prisma.room.delete({ where: { id } });
    }
}
exports.RoomRepository = RoomRepository;
