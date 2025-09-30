"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationRepository = void 0;
const prisma_1 = require("../config/prisma");
class ReservationRepository {
    async create(reservation) {
        return prisma_1.prisma.reservation.create({ data: reservation });
    }
    async findAll() {
        return prisma_1.prisma.reservation.findMany();
    }
    async findById(id) {
        return prisma_1.prisma.reservation.findUnique({ where: { id } });
    }
    async findConflicts(roomId, startDate, endDate) {
        return prisma_1.prisma.reservation.findMany({
            where: {
                roomId,
                AND: [
                    { startDate: { lt: endDate } },
                    { endDate: { gt: startDate } }
                ]
            }
        });
    }
    async update(id, reservation) {
        return prisma_1.prisma.reservation.update({ where: { id }, data: reservation });
    }
    async delete(id) {
        await prisma_1.prisma.reservation.delete({ where: { id } });
    }
}
exports.ReservationRepository = ReservationRepository;
