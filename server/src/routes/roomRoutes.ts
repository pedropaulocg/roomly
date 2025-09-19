import { Router, Request, Response } from "express";
import { RoomController } from "../controllers/RoomController";

const roomRoutes = Router();
const roomController = new RoomController();

roomRoutes.post('/', (req: Request, res: Response) => roomController.createRoom(req, res));
roomRoutes.get('/', (req: Request, res: Response) => roomController.getAllRooms(req, res));
roomRoutes.get('/:id', (req: Request, res: Response) => roomController.getRoomById(req, res));
roomRoutes.put('/:id', (req: Request, res: Response) => roomController.updateRoom(req, res));
roomRoutes.delete('/:id', (req: Request, res: Response) => roomController.deleteRoom(req, res));

export default roomRoutes;
