import { IReservation } from "../models/Reservation";
import { ReservationRepository } from "../repositories/ReservationRepository";

export class ReservationServices {
  private reservationRepository: ReservationRepository;

  constructor() {
    this.reservationRepository = new ReservationRepository();
  }

  async createReservation(reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
    const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
    if (conflicts.length) {
      throw new Error("Date conflict: room is already reserved for this period");
    }
    return this.reservationRepository.create(reservation);
  }

  async getAllReservations(): Promise<IReservation[]> {
    return this.reservationRepository.findAll();
  }

  async getReservationById(id: number): Promise<IReservation | null> {
    return this.reservationRepository.findById(id);
  }

  async updateReservation(id: number, reservation: Omit<IReservation, "id" | "createdAt" | "updatedAt">): Promise<IReservation> {
    const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
    const filtered = conflicts.filter(r => r.id !== id);
    if (filtered.length) {
      throw new Error("Date conflict: room is already reserved for this period");
    }
    return this.reservationRepository.update(id, reservation);
  }

  async deleteReservation(id: number): Promise<void> {
    await this.reservationRepository.delete(id);
  }
}
