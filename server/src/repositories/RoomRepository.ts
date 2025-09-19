import { prisma } from "../config/prisma";
import { IRoom, IRoomRepository } from "../models/Room";

export class RoomRepository implements IRoomRepository {
  async create(room: Omit<IRoom, "id" | "createdAt" | "updatedAt">): Promise<IRoom> {
    return prisma.room.create({ data: room });
  }

  async findAll(): Promise<IRoom[]> {
    return prisma.room.findMany();
  }

  async findById(id: number): Promise<IRoom | null> {
    return prisma.room.findUnique({ where: { id } });
  }

  async update(id: number, room: Omit<IRoom, "id" | "createdAt" | "updatedAt">): Promise<IRoom> {
    return prisma.room.update({ where: { id }, data: room });
  }

  async delete(id: number): Promise<void> {
    await prisma.room.delete({ where: { id } });
  }
}
