"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationServices = void 0;
const ReservationRepository_1 = require("../repositories/ReservationRepository");
class ReservationServices {
    reservationRepository;
    constructor() {
        this.reservationRepository = new ReservationRepository_1.ReservationRepository();
    }
    async createReservation(reservation) {
        const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
        if (conflicts.length) {
            throw new Error("Date conflict: room is already reserved for this period");
        }
        return this.reservationRepository.create(reservation);
    }
    async getAllReservations() {
        return this.reservationRepository.findAll();
    }
    async getReservationById(id) {
        return this.reservationRepository.findById(id);
    }
    async updateReservation(id, reservation) {
        const conflicts = await this.reservationRepository.findConflicts(reservation.roomId, reservation.startDate, reservation.endDate);
        const filtered = conflicts.filter(r => r.id !== id);
        if (filtered.length) {
            throw new Error("Date conflict: room is already reserved for this period");
        }
        return this.reservationRepository.update(id, reservation);
    }
    async deleteReservation(id) {
        await this.reservationRepository.delete(id);
    }
}
exports.ReservationServices = ReservationServices;
