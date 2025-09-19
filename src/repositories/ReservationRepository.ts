import { prisma } from "../config/prisma";
import { IReservation, IReservationRepository } from "../models/Reservation";

export class ReservationRepository implements IReservationRepository {
  async create(reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
    return prisma.reservation.create({ data: reservation });
  }

  async findAll(): Promise<IReservation[]> {
    return prisma.reservation.findMany();
  }

  async findById(id: number): Promise<IReservation | null> {
    return prisma.reservation.findUnique({ where: { id } });
  }

  async findConflicts(roomId: number, startDate: Date, endDate: Date): Promise<IReservation[]> {
    return prisma.reservation.findMany({
      where: {
        roomId,
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } }
        ]
      }
    });
  }

  async update(id: number, reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
    return prisma.reservation.update({ where: { id }, data: reservation });
  }

  async delete(id: number): Promise<void> {
    await prisma.reservation.delete({ where: { id } });
  }
}
