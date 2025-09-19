import { ReservationServices } from "../services/ReservationServices";
import { Request, Response } from "express";
import { ReservationType } from "../models/Reservation";

type ReservationRequest = {
  startDate: string;
  endDate: string;
  type: ReservationType;
  totalPrice: number;
  clientId: number;
  roomId: number;
};

export class ReservationController {
  private reservationServices: ReservationServices;

  constructor() {
    this.reservationServices = new ReservationServices();
  }

  async createReservation(req: Request, res: Response) {
    const data = req.body as ReservationRequest;
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

  async getAllReservations(req: Request, res: Response) {
    const reservations = await this.reservationServices.getAllReservations();
    res.status(200).json(reservations);
  }

  async getReservationById(req: Request, res: Response) {
    const { id } = req.params;
    const reservation = await this.reservationServices.getReservationById(Number(id));
    res.status(200).json(reservation);
  }

  async updateReservation(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as ReservationRequest;
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

  async deleteReservation(req: Request, res: Response) {
    const { id } = req.params;
    await this.reservationServices.deleteReservation(Number(id));
    res.status(200).json({ message: "Reservation deleted successfully" });
  }
}
