import { RoomServices } from "../services/RoomServices";
import { Request, Response } from "express";

type RoomRequest = {
  name: string;
  capacity: number;
  location: string;
  pricePerHour: number;
  pricePerDay: number;
  photo?: string;
  ownerId: number;
};

export class RoomController {
  private roomServices: RoomServices;

  constructor() {
    this.roomServices = new RoomServices();
  }

  async createRoom(req: Request, res: Response) {
    const data = req.body as RoomRequest;
    const room = await this.roomServices.createRoom({
      ...data,
      photo: data.photo || null,
    });
    res.status(201).json(room);
  }

  async getAllRooms(req: Request, res: Response) {
    const rooms = await this.roomServices.getAllRooms();
    res.status(200).json(rooms);
  }

  async getRoomById(req: Request, res: Response) {
    const { id } = req.params;
    const room = await this.roomServices.getRoomById(Number(id));
    res.status(200).json(room);
  }

  async updateRoom(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as RoomRequest;
    const room = await this.roomServices.updateRoom(Number(id), {
      ...data,
      photo: data.photo || null,
    });
    res.status(200).json(room);
  }

  async deleteRoom(req: Request, res: Response) {
    const { id } = req.params;
    await this.roomServices.deleteRoom(Number(id));
    res.status(200).json({ message: "Room deleted successfully" });
  }
}
