"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const ReservationServices_1 = require("../services/ReservationServices");
class ReservationController {
    reservationServices;
    constructor() {
        this.reservationServices = new ReservationServices_1.ReservationServices();
    }
    async createReservation(req, res) {
        const data = req.body;
        const reservation = await this.reservationServices.createReservation({
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            type: data.type,
            totalPrice: data.totalPrice,
            clientId: data.clientId,
            roomId: data.roomId
        });
        res.status(201).json(reservation);
    }
    async getAllReservations(req, res) {
        const reservations = await this.reservationServices.getAllReservations();
        res.status(200).json(reservations);
    }
    async getReservationById(req, res) {
        const { id } = req.params;
        const reservation = await this.reservationServices.getReservationById(Number(id));
        res.status(200).json(reservation);
    }
    async updateReservation(req, res) {
        const { id } = req.params;
        const data = req.body;
        const reservation = await this.reservationServices.updateReservation(Number(id), {
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            type: data.type,
            totalPrice: data.totalPrice,
            clientId: data.clientId,
            roomId: data.roomId
        });
        res.status(200).json(reservation);
    }
    async deleteReservation(req, res) {
        const { id } = req.params;
        await this.reservationServices.deleteReservation(Number(id));
        res.status(200).json({ message: "Reservation deleted successfully" });
    }
}
exports.ReservationController = ReservationController;
