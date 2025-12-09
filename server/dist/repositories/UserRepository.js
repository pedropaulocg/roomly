"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = require("../config/prisma");
class UserRepository {
    async create(user, options) {
        const include = {};
        if (options?.includeRooms)
            include.rooms = true;
        if (options?.includeReservations)
            include.reservations = true;
        return prisma_1.prisma.user.create({
            data: user,
            include: Object.keys(include).length > 0 ? include : undefined,
        });
    }
    async findAll(options) {
        const page = options?.page;
        const limit = options?.limit;
        const include = {};
        if (options?.includeRooms)
            include.rooms = true;
        if (options?.includeReservations)
            include.reservations = true;
        // Se paginação foi solicitada, retornar objeto com metadados
        if (page !== undefined && limit !== undefined) {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
                prisma_1.prisma.user.findMany({
                    skip,
                    take: limit,
                    include: Object.keys(include).length > 0 ? include : undefined,
                }),
                prisma_1.prisma.user.count(),
            ]);
            return { data, total, page, limit };
        }
        // Sem paginação, retornar array simples (compatibilidade)
        return prisma_1.prisma.user.findMany({
            include: Object.keys(include).length > 0 ? include : undefined,
        });
    }
    async findById(id, options) {
        // Usar select para evitar referências circulares quando solicitado
        if (options?.useSelect) {
            const select = {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            };
            if (options?.includeRooms) {
                select.rooms = {
                    select: {
                        id: true,
                        name: true,
                        capacity: true,
                        location: true,
                        pricePerHour: true,
                        pricePerDay: true,
                        photo: true,
                        createdAt: true,
                        updatedAt: true,
                        // Não incluir owner para evitar referência circular
                    },
                };
            }
            if (options?.includeReservations) {
                select.reservations = {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        type: true,
                        totalPrice: true,
                        createdAt: true,
                        updatedAt: true,
                        // Não incluir client ou room para evitar referências circulares
                    },
                };
            }
            return prisma_1.prisma.user.findUnique({
                where: { id },
                select,
            });
        }
        // Usar include tradicional quando useSelect não é especificado
        const include = {};
        if (options?.includeRooms)
            include.rooms = true;
        if (options?.includeReservations)
            include.reservations = true;
        return prisma_1.prisma.user.findUnique({
            where: { id },
            include: Object.keys(include).length > 0 ? include : undefined,
        });
    }
    async findByEmail(email, options) {
        const include = {};
        if (options?.includeRooms)
            include.rooms = true;
        if (options?.includeReservations)
            include.reservations = true;
        return prisma_1.prisma.user.findUnique({
            where: { email },
            include: Object.keys(include).length > 0 ? include : undefined,
        });
    }
    async update(id, user, options) {
        const include = {};
        if (options?.includeRooms)
            include.rooms = true;
        if (options?.includeReservations)
            include.reservations = true;
        return prisma_1.prisma.user.update({
            where: { id },
            data: user,
            include: Object.keys(include).length > 0 ? include : undefined,
        });
    }
    async delete(id) {
        await prisma_1.prisma.user.delete({ where: { id } });
    }
}
exports.UserRepository = UserRepository;
