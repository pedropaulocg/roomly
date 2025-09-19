import { Router, Request, Response } from "express";
import { ReservationController } from "../controllers/ReservationController";

const reservationRoutes = Router();
const reservationController = new ReservationController();

reservationRoutes.post('/', (req: Request, res: Response) => reservationController.createReservation(req, res));
reservationRoutes.get('/', (req: Request, res: Response) => reservationController.getAllReservations(req, res));
reservationRoutes.get('/:id', (req: Request, res: Response) => reservationController.getReservationById(req, res));
reservationRoutes.put('/:id', (req: Request, res: Response) => reservationController.updateReservation(req, res));
reservationRoutes.delete('/:id', (req: Request, res: Response) => reservationController.deleteReservation(req, res));

export default reservationRoutes;
